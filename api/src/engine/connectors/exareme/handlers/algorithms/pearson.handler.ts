import * as jsonata from 'jsonata'; // old import style needed due to 'export = jsonata'
import { Expression } from 'jsonata';
import { Domain } from 'src/engine/models/domain.model';
import { Experiment } from '../../../../models/experiment/experiment.model';
import { HeatMapResult } from '../../../../models/result/heat-map-result.model';
import BaseHandler from '../base.handler';

export default class PearsonHandler extends BaseHandler {
  private static readonly transform: Expression = jsonata(`
  (
    $params := ['correlations', 'p_values', 'ci_lo', 'ci_hi'];
    $dictName := {
        "correlations": "Correlations",
        "p_values": "P values",
        "ci_lo": 'Low confidence intervals',
        "ci_hi": 'High confidence intervals'
    };

    $.$sift(function($v, $k) {$k in $params}).$each(function($v, $k) {
        {
            'name': $lookup($dictName, $k),
            'xAxis': {
                'categories': $v.variables
            },
            'yAxis': {
                'categories': $reverse($v.variables)
            },
            'matrix': $v.$sift(function($val, $key) {$key ~> /^(?!variables$)/}).$each(function($val, $key) {$val})[]
            }
    })
  )`);

  /**
   * This function returns true if the algorithm is Pearson.
   * @param {string} algorithm - The name of the algorithm to use.
   * @returns a boolean value.
   */
  canHandle(algorithm: string, data: any): boolean {
    return (
      algorithm.toLocaleLowerCase() === 'pearson' &&
      data &&
      data[0] &&
      data[0]['correlations'] &&
      data[0]['p_values']
    );
  }

  handle(exp: Experiment, data: any, domain?: Domain): void {
    if (!this.canHandle(exp.algorithm.name, data))
      return super.handle(exp, data, domain);

    const extData = data[0];

    const results = PearsonHandler.transform.evaluate(
      extData,
    ) as HeatMapResult[];
    results
      .filter((heatMap) => heatMap.matrix.length > 0 && heatMap.name)
      .forEach((heatMap) => exp.results.push(heatMap));

    this.next?.handle(exp, data);
  }
}
