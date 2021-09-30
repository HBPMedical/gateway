import { Observable } from 'rxjs';
import { IEngineService } from 'src/engine/engine.interfaces';
import { Domain } from 'src/engine/models/domain.model';
import { ExperimentCreateInput } from 'src/engine/models/experiment/input/experiment-create.input';
import { Experiment } from 'src/engine/models/experiment/experiment.model';

export default class DataShieldService implements IEngineService {
  createExperiment(
    data: ExperimentCreateInput,
  ): Experiment | Promise<Experiment> {
    throw new Error('Method not implemented.');
  }
  createTransient(
    data: ExperimentCreateInput,
  ): Experiment | Promise<Experiment> {
    throw new Error('Method not implemented.');
  }
  getDomains(): Domain[] {
    throw new Error('Method not implemented.');
  }

  demo(): string {
    return 'datashield';
  }

  getActiveUser(): Observable<string> {
    throw new Error('Method not implemented.');
  }

  editActiveUser(): Observable<string> {
    throw new Error('Method not implemented.');
  }

  getExperiment(): Observable<string> {
    throw new Error('Method not implemented.');
  }

  deleteExperiment(): Observable<string> {
    throw new Error('Method not implemented.');
  }

  editExperiment(): Observable<string> {
    throw new Error('Method not implemented.');
  }

  startExperimentTransient(): Observable<string> {
    throw new Error('Method not implemented.');
  }

  startExperiment(): Observable<string> {
    throw new Error('Method not implemented.');
  }

  getExperiments(): Observable<string> {
    throw new Error('Method not implemented.');
  }

  getAlgorithms(): Observable<string> {
    throw new Error('Method not implemented.');
  }
}
