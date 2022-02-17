import jsonata, { Expression } from 'jsonata';
import { ResultUnion } from 'src/engine/models/result/common/result-union.model';
import ResultProducer from '../result-producer.interface';

class PearsonProducer implements ResultProducer {
  readonly pearsonCorellation: Expression = jsonata(`
    {
        'name': "Pearson Corellation",
        'xAxis': {
            'categories': correlations.variables
        },
        'yAxis': {
            'categories': $keys(correlations.$sift(function($v, $k) {$k ~> /^(?!variables$)/}))
        },
        'matrix': correlations.$sift(function($v, $k) {$k ~> /^(?!variables$)/}).$each(function($v, $k) {$v})[]
    }
    `);

  interpret(data: unknown): Array<typeof ResultUnion> {
    throw new Error('Method not implemented.');
  }
}
