import { Experiment } from '../../../../engine/models/experiment/experiment.model';
import AreaHandler from './algorithms/area.handler';
import DescriptiveHandler from './algorithms/descriptive.handler';
import HeatMapHandler from './algorithms/heat-map.handler';
import PCAHandler from './algorithms/PCA.handler';
import PearsonHandler from './algorithms/pearson.handler';
import RawHandler from './algorithms/raw.handler';

const start = new PearsonHandler();

start
  .setNext(new AreaHandler())
  .setNext(new DescriptiveHandler())
  .setNext(new HeatMapHandler())
  .setNext(new PCAHandler())
  .setNext(new RawHandler()); // should be last handler as it works as a fallback (if other handlers could not process the results)

export default (exp: Experiment, data: unknown): Experiment => {
  start.handle(exp, data);
  return exp;
};
