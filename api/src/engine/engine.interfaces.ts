import { Request } from 'express';
import { Observable } from 'rxjs';
import { User } from '../users/models/user.model';
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

  getDomains(ids: string[], req?: Request): Domain[] | Promise<Domain[]>;

  createExperiment(
    data: ExperimentCreateInput,
    isTransient: boolean,
    req?: Request,
  ): Promise<Experiment> | Experiment;

  listExperiments(
    page: number,
    name: string,
    req?: Request,
  ): Promise<ListExperiments> | ListExperiments;

  getExperiment(id: string, req?: Request): Promise<Experiment> | Experiment;

  removeExperiment(
    id: string,
    req?: Request,
  ): Promise<PartialExperiment> | PartialExperiment;

  editExperient(
    id: string,
    expriment: ExperimentEditInput,
    req?: Request,
  ): Promise<Experiment> | Experiment;

  getAlgorithms(req?: Request): Promise<Algorithm[]> | Algorithm[];

  // Standard REST API call
  getAlgorithmsREST(req?: Request): Observable<string> | string;

  getActiveUser?(req?: Request): Promise<User> | User;

  updateUser?(req?: Request): Promise<User> | User;

  logout?(req?: Request): void;

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

  getPassthrough?(suffix: string, req?: Request): Observable<string> | string;
}
