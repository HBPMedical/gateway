import { HttpService } from '@nestjs/axios';
import { Observable } from 'rxjs';
import { IEngineOptions, IEngineService } from 'src/engine/engine.interfaces';

export default class DataShieldService implements IEngineService {
  constructor(
    private readonly options: IEngineOptions,
    private readonly httpService: HttpService,
  ) {}

  demo(): string {
    return 'datashield';
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
