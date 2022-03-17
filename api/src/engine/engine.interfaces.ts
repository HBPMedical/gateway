import { Observable } from 'rxjs';
import { User } from 'src/auth/models/user.model';
import { Configuration } from './models/configuration.model';
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

export type IConfiguration = Pick<Configuration, 'contactLink' | 'galaxy'>;

export interface IEngineService {
  //GraphQL

  /**
   * Allow specific configuration for the engine
   *
   * `connectorId` is always overwrite by the engine module
   */
  getConfiguration?(): IConfiguration;

  getDomains(ids: string[]): Domain[] | Promise<Domain[]>;

  createExperiment(
    data: ExperimentCreateInput,
    isTransient: boolean,
  ): Promise<Experiment> | Experiment;

  listExperiments(
    page: number,
    name: string,
  ): Promise<ListExperiments> | ListExperiments;

  getExperiment(id: string): Promise<Experiment> | Experiment;

  removeExperiment(id: string): Promise<PartialExperiment> | PartialExperiment;

  editExperient(
    id: string,
    expriment: ExperimentEditInput,
  ): Promise<Experiment> | Experiment;

  getAlgorithms(): Promise<Algorithm[]> | Algorithm[];

  // Standard REST API call
  getAlgorithmsREST(): Observable<string> | string;

  getExperiments(): Observable<string> | string;

  getExperimentREST(id: string): Observable<string> | string;

  deleteExperiment(id: string): Observable<string> | string;

  editExperimentREST(id: string): Observable<string> | string;

  startExperimentTransient(): Observable<string> | string;

  startExperiment(): Observable<string> | string;

  getActiveUser(): Observable<string> | string;

  editActiveUser(): Observable<string> | string;

  logout?(): void;

  /**
   * Method that login a user with username and password
   * @param username
   * @param password
   * @returns User object or empty if user not found
   */
  login?(
    username: string,
    password: string,
  ): Promise<User | undefined> | User | undefined;

  getPassthrough?(suffix: string): Observable<string> | string;
}
