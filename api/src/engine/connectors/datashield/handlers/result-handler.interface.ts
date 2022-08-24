import { Experiment } from '../../../models/experiment/experiment.model';
import { Variable } from '../../../models/variable.model';

// produce algo handler
export default interface ResultHandler {
  setNext(h: ResultHandler): ResultHandler;
  handle(partialExperiment: Experiment, data: unknown, vars: Variable[]): void;
}
