import { Domain } from '../../../../engine/models/domain.model';
import { Experiment } from '../../../../engine/models/experiment/experiment.model';
import AnovaOneWayHandler from './algorithms/anova-one-way.handler';
import AnovaTwoWayHandler from './algorithms/anova-two-way.handler';
import DescriptiveHandler from './algorithms/descriptive.handler';
import HistogramHandler from './algorithms/histogram.handler';
import LinearRegressionCVHandler from './algorithms/linear-regression-cv.handler';
import LinearRegressionHandler from './algorithms/linear-regression.handler';
import LogisticRegressionCVHandler from './algorithms/logistic-regression-cv.handler';
import LogisticRegressionHandler from './algorithms/logistic-regression.handler';
import PCAHandler from './algorithms/PCA.handler';
import PearsonHandler from './algorithms/pearson.handler';
import RawHandler from './algorithms/raw.handler';
import TtestIndependentHandler from './algorithms/ttest-independent.handler';
import TtestOnesampleHandler from './algorithms/ttest-onesample.handler';
import TTestPairedHandler from './algorithms/ttest-paired.handler';
import CategoricalNaiveBayesHandler from './algorithms/naive-bayes-categorical.handler';
import GaussianNaiveBayesHandler from './algorithms/naive-bayes-gaussian.handler';
import KMeansHandler from './algorithms/kmeans.handler';
import SVMHandler from './algorithms/svm.handler';

const start = new PearsonHandler();

start
  .setNext(new HistogramHandler())
  .setNext(new DescriptiveHandler())
  .setNext(new AnovaOneWayHandler())
  .setNext(new AnovaTwoWayHandler())
  .setNext(new PCAHandler())
  .setNext(new LinearRegressionHandler())
  .setNext(new LinearRegressionCVHandler())
  .setNext(new LogisticRegressionHandler())
  .setNext(new LogisticRegressionCVHandler())
  .setNext(new TTestPairedHandler())
  .setNext(new TtestOnesampleHandler())
  .setNext(new TtestIndependentHandler())
  .setNext(new CategoricalNaiveBayesHandler())
  .setNext(new GaussianNaiveBayesHandler())
  .setNext(new KMeansHandler())
  .setNext(new SVMHandler())
  .setNext(new RawHandler()); // should be last handler as it works as a fallback (if other handlers could not process the results)

export default (exp: Experiment, data: unknown, domain: Domain): Experiment => {
  start.handle(exp, data, domain);

  return exp;
};
