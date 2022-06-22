import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { ExperimentResult } from 'src/common/interfaces/utilities.interface';
import { ExperimentCreateInput } from 'src/experiments/models/input/experiment-create.input';
import { ExperimentEditInput } from 'src/experiments/models/input/experiment-edit.input';
import { UpdateUserInput } from 'src/users/inputs/update-user.input';
import { User } from 'src/users/models/user.model';
import { ENGINE_MODULE_OPTIONS } from './engine.constants';
import ConnectorConfiguration from './interfaces/connector-configuration.interface';
import Connector from './interfaces/connector.interface';
import EngineOptions from './interfaces/engine-options.interface';
import { Domain } from './models/domain.model';
import { Algorithm } from './models/experiment/algorithm.model';
import {
  Experiment,
  PartialExperiment,
} from './models/experiment/experiment.model';
import { ListExperiments } from './models/experiment/list-experiments.model';
import { FilterConfiguration } from './models/filter/filter-configuration';
import { FormulaOperation } from './models/formula/formula-operation.model';

@Injectable()
export default class EngineService implements Connector {
  private connector: Connector;

  constructor(
    @Inject(ENGINE_MODULE_OPTIONS) private readonly options: EngineOptions,
    private readonly httpService: HttpService,
  ) {}

  getConfiguration?(): ConnectorConfiguration {
    return this.connector.getConfiguration();
  }

  getDomains(ids: string[], req?: Request): Domain[] | Promise<Domain[]> {
    return this.connector.getDomains(ids, req);
  }

  createExperiment?(
    data: ExperimentCreateInput,
    isTransient: boolean,
    req?: Request,
  ): Promise<Experiment> {
    return this.connector.createExperiment(data, isTransient, req);
  }

  runExperiment(
    data: ExperimentCreateInput,
    req?: Request,
  ): Promise<ExperimentResult[]> {
    if (!this.connector.runExperiment)
      throw new Error('Method not implemented.');

    return this.connector.runExperiment(data, req);
  }

  listExperiments?(
    page: number,
    name: string,
    req?: Request,
  ): Promise<ListExperiments> {
    throw new Error('Method not implemented.');
  }
  getExperiment?(id: string, req?: Request): Promise<Experiment> {
    throw new Error('Method not implemented.');
  }
  removeExperiment?(id: string, req?: Request): Promise<PartialExperiment> {
    throw new Error('Method not implemented.');
  }
  editExperiment?(
    id: string,
    data: ExperimentEditInput,
    req?: Request,
  ): Promise<Experiment> {
    throw new Error('Method not implemented.');
  }
  getAlgorithms(req?: Request): Promise<Algorithm[]> {
    throw new Error('Method not implemented.');
  }
  getActiveUser?(req?: Request): Promise<User> {
    throw new Error('Method not implemented.');
  }
  updateUser?(
    req?: Request,
    userId?: string,
    data?: UpdateUserInput,
  ): Promise<User> {
    throw new Error('Method not implemented.');
  }
  getFormulaConfiguration?(req?: Request): Promise<FormulaOperation[]> {
    throw new Error('Method not implemented.');
  }
  getFilterConfiguration?(req?: Request): Promise<FilterConfiguration[]> {
    throw new Error('Method not implemented.');
  }
  logout?(req?: Request): Promise<void> {
    throw new Error('Method not implemented.');
  }
  login?(username: string, password: string): Promise<User> {
    throw new Error('Method not implemented.');
  }
  getPassthrough?(suffix: string, req?: Request): string | Observable<string> {
    throw new Error('Method not implemented.');
  }

  has(name: keyof Connector): boolean {
    return this.connector.hasOwnProperty(name);
  }
}
