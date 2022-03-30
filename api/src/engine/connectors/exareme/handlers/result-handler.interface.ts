import { Experiment } from '../../../models/experiment/experiment.model';

// produce algo handler
export default interface ResultHandler {
  setNext(h: ResultHandler): ResultHandler;
  handle(partialExperiment: Experiment, data: unknown): void;
}
