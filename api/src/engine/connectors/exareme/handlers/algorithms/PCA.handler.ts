import { Experiment } from '../../../../models/experiment/experiment.model';
import { BarChartResult } from '../../../../models/result/bar-chart-result.model';
import { HeatMapResult } from '../../../../models/result/heat-map-result.model';
import BaseHandler from '../base.handler';

export default class PCAHandler extends BaseHandler {
  canHandle(algorithm: string): boolean {
    return algorithm.toLocaleLowerCase() === 'pca';
  }

  handle(exp: Experiment, data: unknown): void {
    if (!this.canHandle(exp.algorithm.id)) return this.next?.handle(exp, data);

    const barChar: BarChartResult = {
      name: 'Eigen values',
      barValues: data['eigen_vals'],
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

    const matrix = data['eigen_vecs'] as number[][];

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

    if (matrix) exp.results.push(heatMapChart);

    this.next?.handle(exp, data);
  }
}
