import { ExperimentData } from './experiment.interface';

export interface ExperimentsData {
  experiments: ExperimentData[];
  currentpage?: number;
  totalExperiments?: number;
  totalPages?: number;
}
