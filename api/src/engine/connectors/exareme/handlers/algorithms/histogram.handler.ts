import {Domain} from '../../../../models/domain.model';
import {Experiment} from '../../../../models/experiment/experiment.model';
import BaseHandler from '../base.handler';
import {BarChartResult, BarEnumValues,} from '../../../../models/result/bar-chart-result.model';

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
    const variableLabel = lookupVar?.label || data.var;
    const enumMapping = lookupVar?.enumerations?.reduce((map, e) => {
      map[e.value] = e.label;
      return map;
    }, {} as Record<string, string>) || {};

    // Ensure proper alignment by explicitly pairing bins with counts
    const pairedBinsCounts = (data.bins as (string | number)[]).map((bin, index) => ({
      bin: enumMapping[bin] || bin.toString(), // Convert bin to label if available
      count: data.counts[index] ?? 0, // Default to 0 if count is null
    }));

    // Extract categories and values
    const categories = pairedBinsCounts.map((pair) => pair.bin);
    const barValues = pairedBinsCounts.map((pair) => pair.count);

    return {
      name: variableLabel,
      barValues,
      xAxis: {
        label: variableLabel,
        categories,
      },
      hasConnectedBars: false,
      yAxis: {
        label: 'Count',
      },
    };
  }

  private getGroupedBarChartResult(
      groupingVar: string,
      defaultChart: BarChartResult,
      data: Exareme2HistogramData[],
      domain: Domain,
  ): BarChartResult {
    const lookupGroupingVar = domain.variables.find((v) => v.id === groupingVar);
    const groupingVarLabel = lookupGroupingVar?.label || groupingVar;
    const enumMapping = lookupGroupingVar?.enumerations?.reduce((map, e) => {
      map[e.value] = e.label;
      return map;
    }, {} as Record<string, string>) || {};

    const groupingVarData = data.filter((d) => d.grouping_var === groupingVar);
    const barEnumValues: BarEnumValues[] = groupingVarData.map((d) => {
      const label = enumMapping[d.grouping_enum] || d.grouping_enum;
      return {
        label,
        values: d.counts.map((c) => (c === null ? 0 : c)),
      };
    });

    return {
      name: `${defaultChart.name} grouped by ${groupingVarLabel}`,
      xAxis: defaultChart.xAxis,
      barValues: null,
      yAxis: defaultChart.yAxis,
      barEnumValues: barEnumValues,
    };
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
    if (!this.canHandle(experiment, data)) {
      return super.handle(experiment, data, domain);
    }

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
                .filter(
                    (d) => d.grouping_var !== null && d.grouping_var !== undefined,
                )
                .map((d) => d.grouping_var),
        ),
    );

    const groupingCharts = groupingVars.map((groupingVar) =>
        this.getGroupedBarChartResult(
            groupingVar,
            selectedVariableChart,
            extractedData,
            domain,
        ),
    );
    if (groupingCharts) {
      groupingCharts.forEach((gc) => {
        experiment.results.push(gc);
      });
    }

    this.next?.handle(experiment, data, domain);
  }
}
