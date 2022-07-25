import { Domain } from 'src/engine/models/domain.model';
import { Experiment } from '../../../../models/experiment/experiment.model';
import { BarChartResult } from '../../../../models/result/bar-chart-result.model';
import { HeatMapResult } from '../../../../models/result/heat-map-result.model';
import BaseHandler from '../base.handler';

export default class PCAHandler extends BaseHandler {
  canHandle(algorithm: string): boolean {
    return algorithm.toLocaleLowerCase() === 'pca';
  }

  handle(exp: Experiment, data: any): void {
    if (
      !this.canHandle(exp.algorithm.name) ||
      !data ||
      !data['eigenvalues'] ||
      !data['eigenvectors']
    )
      return this.next?.handle(exp, data);

    const barChar: BarChartResult = {
      name: 'Eigen values',
      barValues: data['eigenvalues'],
      xAxis: {
        label: 'Dimensions',
        categories: exp.variables.map((_, i) => i + 1).map(String),
      },
      hasConnectedBars: true,
      yAxis: {
        label: 'Eigen values',
      },
    };

    if (barChar.barValues && barChar.barValues.length > 0)
      exp.results.push(barChar);

    const matrix = data['eigenvectors'] as number[][];

    const heatMapChart: HeatMapResult = {
      name: 'Eigen vectors',
      matrix,
      yAxis: {
        categories: exp.variables,
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

    if (heatMapChart.matrix) exp.results.push(heatMapChart);

    this.next?.handle(exp, data);
  }
}
