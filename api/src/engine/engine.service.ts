import { HttpService } from '@nestjs/axios';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotImplementedException,
} from '@nestjs/common';
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

/**
 * Engine service.
 * This class is used as a Proxy to the real Connector.
 */
@Injectable()
export default class EngineService implements Connector {
  private connector: Connector;

  constructor(
    @Inject(ENGINE_MODULE_OPTIONS) private readonly options: EngineOptions,
    private readonly httpService: HttpService,
  ) {
    import(`./connectors/${options.type}/${options.type}.connector`).then(
      (conn) => {
        const instance = new conn.default(options, httpService);

        if (instance.createExperiment && instance.runExperiment)
          throw new InternalServerErrorException(
            `Connector ${options.type} should declare either createExperiment or runExperiment not both`,
          );

        if (
          instance.createExperiment &&
          (!instance.getExperiment ||
            !instance.listExperiments ||
            !instance.removeExperiment ||
            !instance.editExperiment)
        )
          throw new InternalServerErrorException(
            `Connector ${options.type} has 'createExperiment' implemented it implies that getExperiment, listExperiments, removeExperiment and editExperiment methods must also be implemented.`,
          );

        this.connector = instance;
      },
    );
  }

  getConfiguration(): ConnectorConfiguration {
    return this.connector.getConfiguration?.() ?? {};
  }

  getDomains(ids: string[], req?: Request): Domain[] | Promise<Domain[]> {
    return this.connector.getDomains(ids, req);
  }

  getAlgorithms(req?: Request): Promise<Algorithm[]> {
    return this.connector.getAlgorithms(req);
  }

  createExperiment(
    data: ExperimentCreateInput,
    isTransient: boolean,
    req?: Request,
  ): Promise<Experiment> {
    if (!this.connector.createExperiment) throw new NotImplementedException();
    return this.connector.createExperiment(data, isTransient, req);
  }

  runExperiment(
    data: ExperimentCreateInput,
    req?: Request,
  ): Promise<ExperimentResult[]> {
    if (!this.connector.runExperiment) throw new NotImplementedException();
    return this.connector.runExperiment(data, req);
  }

  listExperiments?(
    page: number,
    name: string,
    req?: Request,
  ): Promise<ListExperiments> {
    if (!this.connector.listExperiments) throw new NotImplementedException();
    return this.connector.listExperiments(page, name, req);
  }

  getExperiment?(id: string, req?: Request): Promise<Experiment> {
    if (!this.connector.getExperiment) throw new NotImplementedException();
    return this.connector.getExperiment(id, req);
  }

  removeExperiment?(id: string, req?: Request): Promise<PartialExperiment> {
    if (!this.connector.removeExperiment) throw new NotImplementedException();
    return this.connector.removeExperiment(id, req);
  }

  editExperiment?(
    id: string,
    data: ExperimentEditInput,
    req?: Request,
  ): Promise<Experiment> {
    if (!this.connector.editExperiment) throw new NotImplementedException();
    return this.connector.editExperiment(id, data, req);
  }

  getActiveUser?(req?: Request): Promise<User> {
    if (!this.connector.getActiveUser) throw new NotImplementedException();
    return this.connector.getActiveUser(req);
  }

  updateUser?(
    req?: Request,
    userId?: string,
    data?: UpdateUserInput,
  ): Promise<User> {
    if (!this.connector.updateUser) throw new NotImplementedException();
    return this.connector.updateUser(req, userId, data);
  }

  getFormulaConfiguration?(req?: Request): Promise<FormulaOperation[]> {
    if (!this.connector.getFormulaConfiguration)
      throw new NotImplementedException();
    return this.connector.getFormulaConfiguration(req);
  }

  getFilterConfiguration?(req?: Request): Promise<FilterConfiguration[]> {
    if (!this.connector.getFilterConfiguration)
      throw new NotImplementedException();
    return this.connector.getFilterConfiguration(req);
  }

  logout?(req?: Request): Promise<void> {
    if (!this.connector.logout) throw new NotImplementedException();
    return this.connector.logout(req);
  }

  login?(username: string, password: string): Promise<User> {
    if (!this.connector.login) throw new NotImplementedException();
    return this.connector.login(username, password);
  }

  getPassthrough?(suffix: string, req?: Request): string | Observable<string> {
    if (!this.connector.getPassthrough) throw new NotImplementedException();
    return this.connector.getPassthrough(suffix, req);
  }

  has(name: keyof Connector): boolean {
    return this.connector && typeof this.connector[name] !== undefined;
  }
}
