import * as jsonata from 'jsonata';
import { Experiment } from '../../../../models/experiment/experiment.model';
import {
  AlertLevel,
  AlertResult,
} from '../../../../models/result/alert-result.model';
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

  $append(quants.$each(function($v, $k) {(
      $t := $type($v);
      $t = "array" ? $histoNumber($v, $k) : ($t = "object" ? $histoNominal($v, $k) : undefined)
  )}), heatmaps.(
    $.'1' ? {
      "name": '',
      "xAxis": {
          "label": $clearLabel($.xlab[0]),
          "categories": $.x
      },
      "yAxis": {
          "label": $clearLabel($.ylab[0]),
          "categories": $.y
      },
      "matrix": $transposeMat($.'1')
  } : []))
)
`);

transformToDescriptiveStats.registerFunction(
  'transposeMat',
  (matrix) => {
    if (!matrix) return [[]];

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

  getErrors(data: unknown): AlertResult[] {
    const errors = [];
    if (
      data['heatmaps'] &&
      data['heatmaps'][0] &&
      typeof data['heatmaps'][0][0] === 'string'
    ) {
      errors.push({
        message: 'Heatmaps error: ' + data['heatmaps'][0][0],
        level: AlertLevel.ERROR,
      });
    }

    if (data['quants']) {
      for (const [key, value] of Object.entries(data['quants'])) {
        if (typeof value === 'string') {
          errors.push({
            message: `Table '${key}' error: ` + value,
            level: AlertLevel.ERROR,
          });
        }
      }
    }

    return errors;
  }

  handle(experiment: Experiment, data: unknown, vars: Variable[]): void {
    if (!this.canHandle(experiment.algorithm.name, data))
      return this.next?.handle(experiment, data, vars);

    const results = transformToDescriptiveStats.evaluate(data);
    const errors = this.getErrors(data);

    experiment.results.push(...errors, ...results);
  }
}
