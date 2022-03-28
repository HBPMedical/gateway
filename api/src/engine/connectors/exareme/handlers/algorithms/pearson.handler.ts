import { Expression } from 'jsonata';
import * as jsonata from 'jsonata'; // old import style needed due to 'export = jsonata'
import { AlgoResults } from 'src/common/interfaces/utilities.interface';
import { HeatMapResult } from 'src/engine/models/result/heat-map-result.model';
import BaseHandler from '../base.handler';

export default class PearsonHandler extends BaseHandler {
  readonly transform: Expression = jsonata(`
  (
    $params := ['correlations', 'p-values', 'low_confidence_intervals', 'high_confidence_intervals'];

    $.$sift(function($v, $k) {$k in $params}).$each(function($v, $k) {
        {
            'name': $k,
            'xAxis': {
                'categories': $v.variables
            },
            'yAxis': {
                'categories': $keys($v.$sift(function($val, $key) {$key ~> /^(?!variables$)/}))
            },
            'matrix': $v.$sift(function($val, $key) {$key ~> /^(?!variables$)/}).$each(function($val, $key) {$val})[]
            }
    })
  )`);

  canHandle(algorithm: string): boolean {
    return algorithm.toLocaleLowerCase() === 'pearson';
  }

  handle(algorithm: string, data: unknown, res: AlgoResults): void {
    if (this.canHandle(algorithm)) {
      try {
        const results = this.transform.evaluate(data) as HeatMapResult[];
        results
          .filter((heatMap) => heatMap.matrix.length > 0 && heatMap.name)
          .forEach((heatMap) => res.push(heatMap));
      } catch (e) {
        PearsonHandler.logger.warn(
          'An error occur when converting result from Pearson',
        );
        PearsonHandler.logger.verbose(JSON.stringify(data));
      }
    }

    this.next?.handle(algorithm, data, res);
  }
}
