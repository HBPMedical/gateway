import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { Request } from 'express';
import { firstValueFrom, map, Observable } from 'rxjs';
import EngineService from '../../../engine/engine.service';
import ConnectorConfiguration from '../../../engine/interfaces/connector-configuration.interface';
import Connector from '../../../engine/interfaces/connector.interface';
import EngineOptions from '../../../engine/interfaces/engine-options.interface';
import { Domain } from '../../../engine/models/domain.model';
import { Algorithm } from '../../../engine/models/experiment/algorithm.model';
import {
  Experiment,
  PartialExperiment,
} from '../../../engine/models/experiment/experiment.model';
import { ListExperiments } from '../../../engine/models/experiment/list-experiments.model';
import { FormulaOperation } from '../../../engine/models/formula/formula-operation.model';
import { Group } from '../../../engine/models/group.model';
import { Variable } from '../../../engine/models/variable.model';
import { ExperimentCreateInput } from '../../../experiments/models/input/experiment-create.input';
import { ExperimentEditInput } from '../../../experiments/models/input/experiment-edit.input';
import { User } from '../../../users/models/user.model';
import { transformToUser } from '../datashield/transformations';
import {
  dataToDataset,
  dataToExperiment,
  dataToGroup,
  dataToVariable,
  experimentInputToData,
} from './converters';
import { ExperimentData } from './interfaces/experiment/experiment.interface';
import { ExperimentsData } from './interfaces/experiment/experiments.interface';
import { Hierarchy } from './interfaces/hierarchy.interface';
import { Pathology } from './interfaces/pathology.interface';
import { dataToUser } from './transformations';
import transformToAlgorithms from './transformations/algorithms';

type Headers = Record<string, string>;

@Injectable()
export default class ExaremeConnector implements Connector {
  private static readonly logger = new Logger(ExaremeConnector.name);

  constructor(
    private readonly options: EngineOptions,
    private readonly httpService: HttpService,
    private readonly engineService: EngineService,
  ) {}

  async getFormulaConfiguration(): Promise<FormulaOperation[]> {
    return [
      {
        variableType: 'real',
        operationTypes: ['log', 'exp', 'center', 'standardize'],
      },
      {
        variableType: 'nominal',
        operationTypes: ['dummy', 'poly', 'contrast', 'additive'],
      },
    ];
  }

  getConfiguration(): ConnectorConfiguration {
    return {
      hasGalaxy: true,
      hasGrouping: true,
    };
  }

  async logout(request: Request) {
    const path = `${this.options.baseurl}logout`;

    await firstValueFrom(
      this.get(request, path, {
        maxRedirects: 0,
        validateStatus: (status) => status >= 200 && status <= 302,
      }),
    );
  }

  async createExperiment(
    data: ExperimentCreateInput,
    isTransient = false,
    request: Request,
  ): Promise<Experiment> {
    const domains = await this.engineService.getDomains(request);

    const form = experimentInputToData(data);
    const path =
      this.options.baseurl + `experiments${isTransient ? '/transient' : ''}`;

    const resultAPI = await firstValueFrom(
      this.post<ExperimentData>(request, path, form),
    );
    ExaremeConnector.logger.debug(`${JSON.stringify(resultAPI.data)}`);

    const results = dataToExperiment(
      resultAPI.data,
      ExaremeConnector.logger,
      domains,
    );

    ExaremeConnector.logger.debug(`${JSON.stringify(results)}`);

    return results;
  }

  async listExperiments(
    page: number,
    name: string,
    request: Request,
  ): Promise<ListExperiments> {
    const path = this.options.baseurl + 'experiments';

    const resultAPI = await firstValueFrom(
      this.get<ExperimentsData>(request, path, {
        params: { page, name },
      }),
    );

    return {
      ...resultAPI.data,
      experiments:
        resultAPI.data.experiments?.map((exp) =>
          dataToExperiment(exp, ExaremeConnector.logger),
        ) ?? [],
    };
  }

  async getAlgorithms(request: Request): Promise<Algorithm[]> {
    const path = this.options.baseurl + 'algorithms';

    const resultAPI = await firstValueFrom(
      this.get<string>(request, path, {
        maxRedirects: 0,
      }),
    );

    return transformToAlgorithms.evaluate(resultAPI.data);
  }

  async getExperiment(id: string, request: Request): Promise<Experiment> {
    const path = this.options.baseurl + `experiments/${id}`;

    const resultAPI = await firstValueFrom(
      this.get<ExperimentData>(request, path),
    );

    ExaremeConnector.logger.debug(`${JSON.stringify(resultAPI.data)}`);
    const domains = await this.engineService.getDomains(request);
    const results = dataToExperiment(
      resultAPI.data,
      ExaremeConnector.logger,
      domains,
    );
    ExaremeConnector.logger.debug(`${JSON.stringify(results)}`);

    return results;
  }

  async editExperiment(
    id: string,
    expriment: ExperimentEditInput,
    request: Request,
  ): Promise<Experiment> {
    const path = this.options.baseurl + `experiments/${id}`;

    const resultAPI = await firstValueFrom(
      this.patch<ExperimentData>(request, path, expriment),
    );

    const domains = await this.engineService.getDomains(request);

    return dataToExperiment(resultAPI.data, ExaremeConnector.logger, domains);
  }

  async removeExperiment(
    id: string,
    request: Request,
  ): Promise<PartialExperiment> {
    const path = this.options.baseurl + `experiments/${id}`;

    try {
      await firstValueFrom(this.delete(request, path));
      return {
        id: id,
      };
    } catch (error) {
      throw new BadRequestException(`${id} does not exists`);
    }
  }

  async getDomains(request: Request): Promise<Domain[]> {
    const path = this.options.baseurl + 'pathologies';

    try {
      const data = await firstValueFrom(
        this.get<Pathology[]>(request, path, {
          maxRedirects: 0,
        }),
      );

      return (
        data?.data.map((d): Domain => {
          const groups = this.flattenGroups(d.metadataHierarchy);

          return {
            id: `${d.code}:${d.version}`,
            label: d.version ? `${d.code} ${d.version}` : d.code,
            version: d.version,
            groups: groups,
            rootGroup: dataToGroup(d.metadataHierarchy),
            datasets: d.datasets ? d.datasets.map(dataToDataset) : [],
            variables: d.metadataHierarchy
              ? this.flattenVariables(d.metadataHierarchy, groups)
              : [],
            longitudinal: d.longitudinal,
          };
        }) ?? []
      );
    } catch (error) {
      throw new HttpException(
        `Error in exareme engine : '${error.response.data['message']}'`,
        error.response.data['statusCode'] ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getActiveUser(request: Request): Promise<User> {
    const path = this.options.baseurl + 'activeUser';
    const response = await firstValueFrom(
      this.get<string>(request, path, {
        maxRedirects: 0,
      }),
    );

    try {
      return transformToUser.evaluate(response.data);
    } catch (e) {
      throw new InternalServerErrorException(
        'Cannot parse user data from Engine',
        e,
      );
    }
  }

  async updateUser(request: Request): Promise<User> {
    const path = this.options.baseurl + 'activeUser/agreeNDA';

    const result = await firstValueFrom(
      this.post<string>(request, path, {
        agreeNDA: true,
      }),
    );

    return dataToUser.evaluate(result.data);
  }

  getPassthrough(
    suffix: string,
    request: Request,
  ): string | Observable<string> {
    const path = this.options.baseurl + suffix;

    return this.get<string>(request, path, { params: request.query }).pipe(
      map((response) => response.data),
    );
  }

  // UTILITIES
  private flattenGroups = (data: Hierarchy): Group[] => {
    let groups: Group[] = [dataToGroup(data)];

    if (data.groups) {
      groups = groups.concat(data.groups.flatMap(this.flattenGroups));
    }

    return groups;
  };

  private flattenVariables = (data: Hierarchy, groups: Group[]): Variable[] => {
    const group = groups.find((g) => g.id == data.code);
    let variables = data.variables ? data.variables.map(dataToVariable) : [];

    variables.forEach((variable) => (variable.groups = group ? [group] : []));

    if (data.groups) {
      variables = variables.concat(
        data.groups.flatMap((hierarchy) =>
          this.flattenVariables(hierarchy, groups),
        ),
      );
    }

    return variables;
  };

  private getHeadersFromRequest(request: Request): Headers {
    if (!request || !request.headers) return {};

    return request.headers as Headers;
  }

  private mergeHeaders(
    request: Request,
    config: AxiosRequestConfig,
  ): AxiosRequestConfig {
    return {
      ...config,
      headers: {
        ...this.getHeadersFromRequest(request),
        ...(config.headers ?? {}),
      },
    };
  }

  private get<T = any>(
    request: Request,
    path: string,
    config: AxiosRequestConfig = {},
  ) {
    const conf = this.mergeHeaders(request, config);
    return this.httpService.get<T>(path, conf as any);
  }

  private post<T = any>(
    request: Request,
    path: string,
    data?: any,
    config: AxiosRequestConfig = {},
  ) {
    const conf = this.mergeHeaders(request, config);
    return this.httpService.post<T>(path, data, conf as any);
  }

  private patch<T = any>(
    request: Request,
    path: string,
    data?: any,
    config: AxiosRequestConfig = {},
  ) {
    const conf = this.mergeHeaders(request, config);
    return this.httpService.patch<T>(path, data, conf as any);
  }

  private delete<T = any>(
    request: Request,
    path: string,
    config: AxiosRequestConfig = {},
  ) {
    const conf = this.mergeHeaders(request, config);
    return this.httpService.delete<T>(path, conf as any);
  }
}
