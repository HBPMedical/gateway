import { Domain } from 'src/engine/models/domain.model';
import { Experiment } from '../../../../engine/models/experiment/experiment.model';
import AnovaOneWayHandler from './algorithms/anova-one-way.handler';
import DescriptiveHandler from './algorithms/descriptive.handler';
import LinearRegressionCVHandler from './algorithms/linear-regression-cv.handler';
import LinearRegressionHandler from './algorithms/linear-regression.handler';
import LogisticRegressionHandler from './algorithms/logistic-regression.handler';
import PCAHandler from './algorithms/PCA.handler';
import PearsonHandler from './algorithms/pearson.handler';
import RawHandler from './algorithms/raw.handler';
import TTestPairedHandler from './algorithms/ttest-paired.handler';
import ResultHandler from './result-handler.interface';

const start = new PearsonHandler() as ResultHandler;

start
  .setNext(new DescriptiveHandler())
  .setNext(new AnovaOneWayHandler())
  .setNext(new PCAHandler())
  .setNext(new LinearRegressionHandler())
  .setNext(new LinearRegressionCVHandler())
  .setNext(new LogisticRegressionHandler())
  .setNext(new TTestPairedHandler())
  .setNext(new RawHandler()); // should be last handler as it works as a fallback (if other handlers could not process the results)

export default (exp: Experiment, data: unknown, domain: Domain): Experiment => {
  start.handle(exp, data, domain);
  return exp;
};
