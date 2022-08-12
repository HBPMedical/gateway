import { Variable } from 'src/engine/models/variable.model';
import { Domain } from '../../../../models/domain.model';
import { Experiment } from '../../../../models/experiment/experiment.model';
import { BarChartResult } from '../../../../models/result/bar-chart-result.model';
import {
  HeatMapResult,
  HeatMapStyle,
} from '../../../../models/result/heat-map-result.model';
import BaseHandler from '../base.handler';

export default class PCAHandler extends BaseHandler {
  canHandle(algorithm: string, data: any): boolean {
    return (
      algorithm.toLowerCase() === 'pca' &&
      data &&
      data[0] &&
      data[0]['eigenvalues'] &&
      data[0]['eigenvectors']
    );
  }

  private getBarChartResult(data: any): BarChartResult {
    const barChart: BarChartResult = {
      name: 'Eigen values',
      barValues: data['eigenvalues'],
      xAxis: {
        label: 'Dimensions',
        categories: data['eigenvalues'].map((_: unknown, i: number) => i + 1),
      },
      hasConnectedBars: true,
      yAxis: {
        label: 'Eigen values',
      },
    };

    return barChart;
  }

  private getHeatMapResult(data: any, variables: Variable[]): HeatMapResult {
    const matrix = data['eigenvectors'] as number[][];

    const heatMapChart: HeatMapResult = {
      name: 'Eigen vectors',
      matrix,
      heatMapStyle: HeatMapStyle.BUBBLE,
      yAxis: {
        categories: variables.map((v) => v.label ?? v.id),
      },
      xAxis: {
        categories: [...Array(matrix.length).keys()]
          .map((i) => i + 1)
          .map(String),
      },
    };

    if (matrix && matrix.length > 0) {
      heatMapChart.matrix = matrix[0].map(
        (_, i) => matrix.map((row) => row[i]), // reverse matrix as we want row-major order
      );
    }

    return heatMapChart;
  }

  handle(exp: Experiment, data: any, domain: Domain): void {
    if (!this.canHandle(exp.algorithm.name, data))
      return this.next?.handle(exp, data, domain);

    const extractedData = data[0];

    const variables =
      exp.variables
        ?.map((v) => domain.variables.find((v2) => v2.id === v) ?? { id: v })
        .filter((v) => v) ?? [];

    const barChart = this.getBarChartResult(extractedData);
    if (barChart.barValues && barChart.barValues.length > 0)
      exp.results.push(barChart);

    const heatMapChart = this.getHeatMapResult(extractedData, variables);
    if (heatMapChart.matrix) exp.results.push(heatMapChart);

    this.next?.handle(exp, data, domain);
  }
}
