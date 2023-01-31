import { Domain } from '../../../../models/domain.model';
import { Experiment } from '../../../../models/experiment/experiment.model';
import BaseHandler from '../base.handler';
import {
  BarChartResult,
  BarEnumValues,
} from '../../../../models/result/bar-chart-result.model';

const ALGO_NAME = 'multiple_histograms';

const round = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

export default class HistogramHandler extends BaseHandler {
  private getBarChartResult(data: any): BarChartResult {
    const barChart: BarChartResult = {
      name: data.var,
      barValues: data.counts.map((c) => c ?? 0),
      xAxis: {
        label: 'bins',
        categories: data.bins
          .filter((_, i) => i < data.bins.length - 1) // upper limit counts for 1 extra
          .map((b, i) => `${round(b)}-${round(data.bins[i + 1])}`),
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

    const extractedData = data[0].histogram;

    const defaultChartData = extractedData.find(
      (d) => d.var && !d.grouping_var,
    );
    const defaultChart = this.getBarChartResult(defaultChartData);
    experiment.results.push(defaultChart);

    const groupingVars: string[] = Array.from(
      new Set(
        extractedData
          .filter((d) => d.grouping_var !== null)
          .map((d) => d.grouping_var),
      ),
    );
    const groupingCharts = groupingVars.map((groupingVar) =>
      this.getGroupedBarChartResult(groupingVar, defaultChart, extractedData),
    );

    if (groupingCharts) groupingCharts.map((gc) => experiment.results.push(gc));

    this.next?.handle(experiment, data, domain);
  }
}
