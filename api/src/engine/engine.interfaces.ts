import { Request } from 'express';
import { Observable } from 'rxjs';
import { Domain } from './models/domain.model';
import {
  Experiment,
  PartialExperiment,
} from './models/experiment/experiment.model';
import { ExperimentCreateInput } from './models/experiment/input/experiment-create.input';
import { ExperimentEditInput } from './models/experiment/input/experiment-edit.input';
import { ListExperiments } from './models/experiment/list-experiments.model';

export interface IEngineOptions {
  type: string;
  baseurl: string;
}

export interface IEngineService {
  //GraphQL
  getDomains(ids: string[]): Domain[] | Promise<Domain[]>;

  createExperiment(
    data: ExperimentCreateInput,
    isTransient: boolean,
  ): Promise<Experiment> | Experiment;

  listExperiments(
    page: number,
    name: string,
  ): Promise<ListExperiments> | ListExperiments;

  getExperiment(uuid: string): Promise<Experiment> | Experiment;

  removeExperiment(
    uuid: string,
  ): Promise<PartialExperiment> | PartialExperiment;

  editExperient(
    uuid: string,
    expriment: ExperimentEditInput,
  ): Promise<Experiment> | Experiment;

  // Standard REST API call
  getAlgorithms(request: Request): Observable<string>;

  getExperiments(request: Request): Observable<string>;

  getExperimentAPI(uuid: string): Observable<string>;

  deleteExperiment(uuid: string, request: Request): Observable<string>;

  editExperimentAPI(uuid: string, request: Request): Observable<string>;

  startExperimentTransient(request: Request): Observable<string>;

  startExperiment(request: Request): Observable<string>;

  getActiveUser(request: Request): Observable<string>;

  editActiveUser(request: Request): Observable<string>;
}
