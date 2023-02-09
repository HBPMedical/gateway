import { Domain } from '../../../../models/domain.model';
import { Experiment } from '../../../../models/experiment/experiment.model';
import BaseHandler from '../base.handler';
import {
  BarChartResult,
  BarEnumValues,
} from '../../../../models/result/bar-chart-result.model';

const ALGO_NAME = 'multiple_histograms';

interface Exareme2HistogramData {
  var: string;
  grouping_var: string | null;
  grouping_enum: string | null;
  bins: string[] | number[];
  counts: number[];
}

const round = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

export default class HistogramHandler extends BaseHandler {
  private getBarChartResult(
    data: Exareme2HistogramData,
    domain: Domain,
  ): BarChartResult {
    const lookupVar = domain.variables.find((v) => v.id === data.var);
    const categories =
      lookupVar.type === 'nominal'
        ? lookupVar.enumerations.map((e) => e.value)
        : (data.bins as number[])
            .filter((_, i) => i < data.bins.length - 1) // upper limit counts for 1 extra
            .map(
              (b, i) => `${round(b)}-${round((data.bins as number[])[i + 1])}`,
            );

    const barChart: BarChartResult = {
      name: lookupVar.label,
      barValues: data.counts.map((c) => c ?? 0),
      xAxis: {
        label: 'bins',
        categories,
      },
      hasConnectedBars: false,
      yAxis: {
        label: 'Count',
      },
    };

    return barChart;
  }

  private getGroupedBarChartResult(
    groupingVar: string,
    defaultChart: BarChartResult,
    data: any[],
  ): BarChartResult {
    const groupingVarData = data.filter((d) => d.grouping_var === groupingVar);
    const barEnumValues: BarEnumValues[] = groupingVarData.map((d) => ({
      label: d.grouping_enum,
      values: d.counts.map((c) => (c === null ? 0 : c)),
    }));

    const barChart: BarChartResult = {
      name: `${defaultChart.name} grouped by ${groupingVar}`,
      xAxis: defaultChart.xAxis,
      barValues: null,
      yAxis: defaultChart.yAxis,
      barEnumValues: barEnumValues,
    };

    return barChart;
  }

  canHandle(exp: Experiment, data: any): boolean {
    return (
      exp.algorithm.name.toLowerCase() === ALGO_NAME &&
      data &&
      data[0] &&
      data[0].histogram
    );
  }

  handle(experiment: Experiment, data: unknown, domain: Domain): void {
    if (!this.canHandle(experiment, data))
      return super.handle(experiment, data, domain);

    const extractedData: Exareme2HistogramData[] = data[0].histogram;
    const selectedVariableChartData = extractedData.find(
      (d) => d.var && !d.grouping_var,
    );
    const selectedVariableChart = this.getBarChartResult(
      selectedVariableChartData,
      domain,
    );
    experiment.results.push(selectedVariableChart);

    const groupingVars: string[] = Array.from(
      new Set(
        extractedData
          .filter((d) => d.grouping_var !== null)
          .map((d) => d.grouping_var),
      ),
    );
    const groupingCharts = groupingVars.map((groupingVar) =>
      this.getGroupedBarChartResult(
        groupingVar,
        selectedVariableChart,
        extractedData,
      ),
    );
    if (groupingCharts) groupingCharts.map((gc) => experiment.results.push(gc));

    this.next?.handle(experiment, data, domain);
  }
}
