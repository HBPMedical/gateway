import { Experiment } from '../../engine/models/experiment/experiment.model';

export type ExperimentUpdateDto = Partial<Omit<Experiment, 'id' | 'author'>>;
