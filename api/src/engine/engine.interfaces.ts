import { Request } from 'express';
import { Observable } from 'rxjs';
import { Domain } from './models/domain.model';
import { ExperimentCreateInput } from './models/experiment/experiment-create.input';
import { Experiment } from './models/experiment/experiment.model';

export interface IEngineOptions {
  type: string;
  baseurl: string;
}

export interface IEngineService {
  getDomains(ids: string[]): Domain[] | Promise<Domain[]>;

  getAlgorithms(request: Request): Observable<string>;

  getExperiments(request: Request): Observable<string>;

  getExperiment(uuid: string): Observable<string>;

  deleteExperiment(uuid: string, request: Request): Observable<string>;

  editExperiment(uuid: string, request: Request): Observable<string>;

  startExperimentTransient(request: Request): Observable<string>;

  createTransient(
    data: ExperimentCreateInput,
  ): Promise<Experiment> | Experiment;

  startExperiment(request: Request): Observable<string>;

  getActiveUser(request: Request): Observable<string>;

  editActiveUser(request: Request): Observable<string>;
}
