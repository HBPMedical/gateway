import { Request } from 'express';
import { Observable } from 'rxjs';
import { ExperimentResult } from 'src/common/interfaces/utilities.interface';
import { UpdateUserInput } from 'src/users/inputs/update-user.input';
import { ExperimentCreateInput } from '../../experiments/models/input/experiment-create.input';
import { ExperimentEditInput } from '../../experiments/models/input/experiment-edit.input';
import { User } from '../../users/models/user.model';
import { Domain } from '../models/domain.model';
import { Algorithm } from '../models/experiment/algorithm.model';
import {
  Experiment,
  PartialExperiment,
} from '../models/experiment/experiment.model';
import { ListExperiments } from '../models/experiment/list-experiments.model';
import { FilterConfiguration } from '../models/filter/filter-configuration';
import { FormulaOperation } from '../models/formula/formula-operation.model';
import ConnectorConfiguration from './connector-configuration.interface';

export default interface Connector {
  /**
   * Allow specific configuration for the engine
   */
  getConfiguration?(): ConnectorConfiguration;

  /**
   * Get the list of domains along with a list of variables
   * @param ids - Ids to filter the domain needed
   * @param req - Request - this is the request object from the HTTP request.
   */
  getDomains(ids: string[], req?: Request): Promise<Domain[]>;

  /**
   * Create and return a full detailed experiment
   * @param {ExperimentCreateInput} data - ExperimentCreateInput - this is the data that you want to
   * send to the API.
   * @param [isTransient=false] - If true, the experiment will be created as a transient experiment.
   * @param {Request} req - Request - this is the request object from the HTTP request.
   * @returns An experiment object
   */
  createExperiment?(
    data: ExperimentCreateInput,
    isTransient: boolean,
    req?: Request,
  ): Promise<Experiment>;

  /**
   * Run an experiment and return results (Transient only)
   * @param {ExperimentCreateInput} data - ExperimentCreateInput - Data context for the experiment.
   * @param {Request} req - Request - this is the request object from the HTTP request.
   * @returns ResultUnion
   */
  runExperiment?(
    data: ExperimentCreateInput,
    req?: Request,
  ): Promise<ExperimentResult[]>;

  /**
   * Get a list of experiment (limited to 10 per page)
   * @param page - the page number
   * @param name - the name of the experiment you are looking for
   * @param req - Request - this is the request object from the HTTP request.
   */
  listExperiments?(
    page: number,
    name: string,
    req?: Request,
  ): Promise<ListExperiments>;

  /**
   * It takes an experiment id and a request object, and returns a promise of an experiment
   * @param {string} id - the id of the experiment you want to get
   * @param {Request} req - Request - this is the request object from the HTTP request.
   * @returns An experiment object
   */
  getExperiment?(id: string, req?: Request): Promise<Experiment>;

  /**
   * Remove an experiment
   * @param id - the id of the experiment you want to remove
   * @param req - this is the request object from the user HTTP request
   */
  removeExperiment?(id: string, req?: Request): Promise<PartialExperiment>;

  /**
   * Update an experiment
   * @param id - the id of the experiment you want to remove
   * @param data - this is the data object containing the updated fields
   * @param req - this is the request object from the user HTTP request
   */
  editExperiment?(
    id: string,
    data: ExperimentEditInput,
    req?: Request,
  ): Promise<Experiment>;

  /**
   * Retrieve the list of available algorithms
   * @param req - Request - this is the request object from the HTTP request.
   */
  getAlgorithms(req?: Request): Promise<Algorithm[]>;

  /**
   * Get the current user logged in
   * @param req - Request - this is the request object from the HTTP request.
   */
  getActiveUser?(req?: Request): Promise<User>;

  /**
   * Update the current logged in user
   * @param req - Request - this is the request object from the HTTP request.
   * @param userId - the id to update
   * @param data - Data object with the updated fields
   */
  updateUser?(
    req?: Request,
    userId?: string,
    data?: UpdateUserInput,
  ): Promise<User | undefined>;

  /**
   * This is a method that is used to get the list of formula operations
   * that are available in the engine.
   * @param req - Request - Optional request object from the HTTP request
   * @returns - Formula configuration
   */
  getFormulaConfiguration?(req?: Request): Promise<FormulaOperation[]>;

  /**
   * This is a method that is used to get the filter configuration
   * that is available in the engine.
   * @param req - Request - Optional request object from the HTTP request
   * @returns Filter configuration
   */
  getFilterConfiguration?(req?: Request): Promise<FilterConfiguration[]>;

  /**
   * Perform a logout on the current logged in user
   * @param req - Request - this is the request object from the HTTP request.
   */
  logout?(req?: Request): Promise<void>;

  /**
   * Method that login a user with username and password
   * @param username
   * @param password
   * @returns User object or empty if user not found
   */
  login?(username: string, password: string): Promise<User | undefined>;

  getPassthrough?(suffix: string, req?: Request): Observable<string> | string;
}
