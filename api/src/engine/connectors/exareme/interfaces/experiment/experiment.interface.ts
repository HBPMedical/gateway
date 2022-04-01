import { ResultExperiment } from './result-experiment.interface';

export interface ExperimentData {
  name: string;
  uuid?: string;
  status?: string;
  createdBy?: string;
  created: string;
  shared?: boolean;
  viewed?: boolean;
  result?: ResultExperiment[];
}
