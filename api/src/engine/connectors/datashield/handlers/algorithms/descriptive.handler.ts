import * as jsonata from 'jsonata';
import { Experiment } from '../../../../models/experiment/experiment.model';
import { Variable } from '../../../../models/variable.model';
import BaseHandler from '../base.handler';

const transformToDescriptiveStats = jsonata(`
(
  $clearLabel := function($label) {
      $trim($replace($label, '.', ' '))
  };

  $histoNumber := function($v, $k) {
      {
          "name": $clearLabel($k),
          "headers": ['5%','10%','25%','50%','75%','90%','95%','Mean'].{
              "name": $,
              "type": "string"
          },
          "data": [[$v]]
      }
  };

  $histoNominal := function($v, $k) {
      {
          "name": $clearLabel($k),
          "headers": $keys($v).{
              "name": $,
              "type": "string"
          },
          "data": [[$v.*]]
      }
  };

  $append(quants.$each(function($v, $k) {
      $type($v) = "array" ? $histoNumber($v, $k) : $histoNominal($v, $k)
  }), heatmaps.{
      "name": '',
      "xAxis": {
          "label": $clearLabel($.xlab),
          "categories": $.x
      },
      "yAxis": {
          "label": $clearLabel($.ylab),
          "categories": $.y
      },
      "matrix": $transposeMat($.'1')
  })
)[]
`);

transformToDescriptiveStats.registerFunction(
  'transposeMat',
  (matrix) => {
    const invMatrix = [];

    for (let i = 0; i < matrix[0].length; i++) {
      invMatrix.push([]);
      for (const elem of matrix) {
        invMatrix[i].push(elem[i]);
      }
    }

    return invMatrix;
  },
  '<a<a<n>:a<a<n>>',
);

export default class DescriptiveHandler extends BaseHandler {
  public static readonly ALGO_NAME = 'descriptive_stats';

  canHandle(algorithm: string, data: unknown): boolean {
    return (
      algorithm.toLowerCase() === DescriptiveHandler.ALGO_NAME &&
      data &&
      (data['quants'] || data['heatmaps'])
    );
  }

  handle(experiment: Experiment, data: unknown, vars: Variable[]): void {
    if (!this.canHandle(experiment.algorithm.name, data))
      return this.next?.handle(experiment, data, vars);

    const results = transformToDescriptiveStats.evaluate(data);

    experiment.results.push(...results);
  }
}
