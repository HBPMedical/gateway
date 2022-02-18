import jsonata, { Expression } from 'jsonata';
import { Results } from 'src/common/interfaces/utilities.interface';
import BaseHandler from '../base.handler';

class PearsonHandler extends BaseHandler {
  readonly pearsonCorellation: Expression = jsonata(`
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

  handle(data: JSON, res: Results): void {
    try {
      const results = this.pearsonCorellation.evaluate(data);
    } catch (e) {}
  }
}
