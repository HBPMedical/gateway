import { Variable } from 'src/engine/models/variable.model';
import { Experiment } from '../../../../engine/models/experiment/experiment.model';
import ErrorAlgorithmHandler from './algorithms/error-algorithm.handler';
import LinearRegressionHandler from './algorithms/linear-regression.handler';
import TerminalAlgorithmHandler from './algorithms/terminal-algorithm.handler';

const start = new ErrorAlgorithmHandler();

start
  .setNext(new LinearRegressionHandler())
  .setNext(new TerminalAlgorithmHandler());

export default (
  exp: Experiment,
  data: unknown,
  vars: Variable[],
): Experiment => {
  start.handle(exp, data, vars);
  return exp;
};
