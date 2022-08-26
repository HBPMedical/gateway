import { HttpService } from '@nestjs/axios';
import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotImplementedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { ExperimentResult } from '../common/interfaces/utilities.interface';
import cacheConfig from '../config/cache.config';
import { ExperimentCreateInput } from '../experiments/models/input/experiment-create.input';
import { ExperimentEditInput } from '../experiments/models/input/experiment-edit.input';
import { UpdateUserInput } from '../users/inputs/update-user.input';
import { User } from '../users/models/user.model';
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
import { Variable } from './models/variable.model';

const DOMAINS_CACHE_KEY = 'domains';
const ALGORITHMS_CACHE_KEY = 'algorithms';
const CACHE_KEYS = [DOMAINS_CACHE_KEY, ALGORITHMS_CACHE_KEY];

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
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject(cacheConfig.KEY) private cacheConf: ConfigType<typeof cacheConfig>,
  ) {
    import(`./connectors/${options.type}/${options.type}.connector`).then(
      (conn) => {
        const instance = new conn.default(options, httpService, this);

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

  /**
   * "If the cache is enabled, try to get the value from the cache, otherwise call the function and cache
   * the result."
   *
   * The function takes two arguments:
   *
   * * `key`: The key to use for the cache.
   * * `fn`: The function to call if the value is not in the cache
   * @param {string} key - The key to use for the cache.
   * @param fn - () => Promise<T>
   * @returns The result of the function call.
   */
  private async getFromCacheOrCall<T>(
    key: string,
    fn: () => Promise<T>,
  ): Promise<T | undefined> {
    if (!key || !this.cacheConf.enabled) return fn();

    const cached = await this.cacheManager.get<T>(key);
    if (cached) return cached;

    console.log(`Cache for ${key} not found. Calling function.`);

    const result = await fn();

    this.cacheManager.set(key, result, { ttl: this.cacheConf.ttl });

    return result;
  }

  async getDomains(req: Request): Promise<Domain[]> {
    const user = req?.user as User;
    const key = user.id ? `${DOMAINS_CACHE_KEY}-${user.id}` : undefined;

    return this.getFromCacheOrCall<Domain[]>(key, () =>
      this.connector.getDomains(req),
    );
  }

  async getAlgorithms(req: Request): Promise<Algorithm[]> {
    const user = req?.user as User;
    const key = user.id ? `${ALGORITHMS_CACHE_KEY}-${user.id}` : undefined;

    return this.getFromCacheOrCall<Algorithm[]>(key, () =>
      this.connector.getAlgorithms(req),
    );
  }

  /**
   * It takes a domain ID and a list of variable IDs, and returns a list of variables that match the IDs
   * @param {string} domainId - The domain ID of the domain you want to get variables from.
   * @param {string[]} varIds - The list of variable IDs to get.
   * @param {Request} request - The request object from the HTTP request.
   * @returns An array of variables
   */
  async getVariables(
    domainId: string,
    varIds: string[],
    request: Request,
  ): Promise<Variable[]> {
    if (!domainId || varIds.length === 0) return [];

    const domains = await this.getDomains(request);

    return (
      domains
        .find((d) => d.id === domainId)
        ?.variables?.filter((v) => varIds.includes(v.id)) ?? []
    );
  }

  async createExperiment(
    data: ExperimentCreateInput,
    isTransient: boolean,
    req?: Request,
  ): Promise<Experiment> {
    if (!this.connector.createExperiment) throw new NotImplementedException();
    return this.connector.createExperiment(data, isTransient, req);
  }

  async runExperiment(
    data: ExperimentCreateInput,
    req?: Request,
  ): Promise<ExperimentResult[]> {
    if (!this.connector.runExperiment) throw new NotImplementedException();
    return this.connector.runExperiment(data, req);
  }

  async listExperiments?(
    page: number,
    name: string,
    req?: Request,
  ): Promise<ListExperiments> {
    if (!this.connector.listExperiments) throw new NotImplementedException();
    return this.connector.listExperiments(page, name, req);
  }

  async getExperiment?(id: string, req?: Request): Promise<Experiment> {
    if (!this.connector.getExperiment) throw new NotImplementedException();
    return this.connector.getExperiment(id, req);
  }

  async removeExperiment?(
    id: string,
    req?: Request,
  ): Promise<PartialExperiment> {
    if (!this.connector.removeExperiment) throw new NotImplementedException();
    return this.connector.removeExperiment(id, req);
  }

  async editExperiment?(
    id: string,
    data: ExperimentEditInput,
    req?: Request,
  ): Promise<Experiment> {
    if (!this.connector.editExperiment) throw new NotImplementedException();
    return this.connector.editExperiment(id, data, req);
  }

  async getActiveUser?(req?: Request): Promise<User> {
    if (!this.connector.getActiveUser) throw new NotImplementedException();
    return this.connector.getActiveUser(req);
  }

  async updateUser?(
    req?: Request,
    userId?: string,
    data?: UpdateUserInput,
  ): Promise<User> {
    if (!this.connector.updateUser) throw new NotImplementedException();
    return this.connector.updateUser(req, userId, data);
  }

  async getFormulaConfiguration?(req?: Request): Promise<FormulaOperation[]> {
    if (!this.connector.getFormulaConfiguration)
      throw new NotImplementedException();
    return this.connector.getFormulaConfiguration(req);
  }

  async getFilterConfiguration?(req?: Request): Promise<FilterConfiguration[]> {
    if (!this.connector.getFilterConfiguration)
      throw new NotImplementedException();
    return this.connector.getFilterConfiguration(req);
  }

  async logout(req: Request): Promise<void> {
    await this.clearCache(req);

    if (this.connector.logout) this.connector.logout(req);
  }

  /**
   * It deletes all the cache keys for the current user
   * @param {Request} req - Request - The request object.
   * @returns A promise that resolves to an array of promises that resolve to undefined.
   */
  async clearCache(req: Request): Promise<void> {
    const user = req?.user as User;

    if (!user || !user.id) return;

    await Promise.all(
      CACHE_KEYS.map((key) => `${key}-${user.id}`).map((key) =>
        this.cacheManager.del(key),
      ),
    );
  }

  async login?(username: string, password: string): Promise<User> {
    if (!this.connector.login) throw new NotImplementedException();
    return this.connector.login(username, password);
  }

  getPassthrough?(suffix: string, req?: Request): string | Observable<string> {
    if (!this.connector.getPassthrough) throw new NotImplementedException();
    return this.connector.getPassthrough(suffix, req);
  }

  has(name: keyof Connector): boolean {
    return this.connector && this.connector[name] !== undefined;
  }
}
