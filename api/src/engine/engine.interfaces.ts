import { Observable } from 'rxjs';
import { Domain } from './models/domain.model';
import { Algorithm } from './models/experiment/algorithm.model';
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

  getAlgorithms(): Promise<Algorithm[]> | Algorithm[];

  // Standard REST API call
  getAlgorithmsREST(): Observable<string> | string;

  getExperiments(): Observable<string> | string;

  getExperimentREST(uuid: string): Observable<string> | string;

  deleteExperiment(uuid: string): Observable<string> | string;

  editExperimentREST(uuid: string): Observable<string> | string;

  startExperimentTransient(): Observable<string> | string;

  startExperiment(): Observable<string> | string;

  getActiveUser(): Observable<string> | string;

  editActiveUser(): Observable<string> | string;

  logout(): void;

  getPassthrough?(suffix: string): Observable<string> | string;
}
