import { AlgoResults } from 'src/common/interfaces/utilities.interface';
import AreaHandler from './algorithms/area.handler';
import DescriptiveHandler from './algorithms/descriptive.handler';
import HeatMapHandler from './algorithms/heat-map.handler';
import {
  default as PearsonHandler,
  default as RawHandler,
} from './algorithms/raw.handler';

const last = new RawHandler(); // should be last handler as it works as a fallback (if other handlers could not process the results)
const start = new PearsonHandler()
  .setNext(new AreaHandler())
  .setNext(new DescriptiveHandler())
  .setNext(new HeatMapHandler())
  .setNext(last);

export default (algo: string, data: unknown, res: AlgoResults) => {
  start.handle(algo, data, res);
};
