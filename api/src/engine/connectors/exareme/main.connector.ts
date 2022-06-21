import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { Request } from 'express';
import { firstValueFrom, map, Observable } from 'rxjs';
import { ENGINE_MODULE_OPTIONS } from 'src/engine/engine.constants';
import {
  IConfiguration,
  IEngineOptions,
  IEngineService,
} from 'src/engine/engine.interfaces';
import { Domain } from 'src/engine/models/domain.model';
import { Algorithm } from 'src/engine/models/experiment/algorithm.model';
import {
  Experiment,
  PartialExperiment,
} from 'src/engine/models/experiment/experiment.model';
import { ListExperiments } from 'src/engine/models/experiment/list-experiments.model';
import { FormulaOperation } from 'src/engine/models/formula/formula-operation.model';
import { Group } from 'src/engine/models/group.model';
import { Variable } from 'src/engine/models/variable.model';
import { ExperimentCreateInput } from 'src/experiments/models/input/experiment-create.input';
import { ExperimentEditInput } from 'src/experiments/models/input/experiment-edit.input';
import { User } from 'src/users/models/user.model';
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
export default class ExaremeService implements IEngineService {
  constructor(
    @Inject(ENGINE_MODULE_OPTIONS) private readonly options: IEngineOptions,
    private readonly httpService: HttpService,
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

  getConfiguration(): IConfiguration {
    return {
      contactLink: 'https://ebrains.eu/support/',
      hasGalaxy: true,
      hasGrouping: true,
    };
  }

  async logout(request: Request) {
    const path = `${this.options.baseurl}logout`;

    await firstValueFrom(this.get(request, path));
  }

  async createExperiment(
    data: ExperimentCreateInput,
    isTransient = false,
    request: Request,
  ): Promise<Experiment> {
    const form = experimentInputToData(data);

    const path =
      this.options.baseurl + `experiments${isTransient ? '/transient' : ''}`;

    const resultAPI = await firstValueFrom(
      this.post<ExperimentData>(request, path, form),
    );

    return dataToExperiment(resultAPI.data);
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
      experiments: resultAPI.data.experiments?.map(dataToExperiment) ?? [],
    };
  }

  async getAlgorithms(request: Request): Promise<Algorithm[]> {
    const path = this.options.baseurl + 'algorithms';

    const resultAPI = await firstValueFrom(this.get<string>(request, path));

    return transformToAlgorithms.evaluate(resultAPI.data);
  }
  async getExperiment(id: string, request: Request): Promise<Experiment> {
    const path = this.options.baseurl + `experiments/${id}`;

    const resultAPI = await firstValueFrom(
      this.get<ExperimentData>(request, path),
    );

    return dataToExperiment(resultAPI.data);
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

    return dataToExperiment(resultAPI.data);
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

  async getDomains(ids: string[], request: Request): Promise<Domain[]> {
    const path = this.options.baseurl + 'pathologies';

    try {
      const data = await firstValueFrom(this.get<Pathology[]>(request, path));

      return (
        data?.data
          .filter((d) => !ids || ids.length == 0 || ids.includes(d.code))
          .map((d): Domain => {
            const groups = this.flattenGroups(d.metadataHierarchy);

            return {
              id: d.code,
              label: d.label,
              groups: groups,
              rootGroup: dataToGroup(d.metadataHierarchy),
              datasets: d.datasets ? d.datasets.map(dataToDataset) : [],
              variables: d.metadataHierarchy
                ? this.flattenVariables(d.metadataHierarchy, groups)
                : [],
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
    const response = await firstValueFrom(this.get<string>(request, path));

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
    return this.httpService.get<T>(path, conf);
  }

  private post<T = any>(
    request: Request,
    path: string,
    data?: any,
    config: AxiosRequestConfig = {},
  ) {
    const conf = this.mergeHeaders(request, config);
    return this.httpService.post<T>(path, data, conf);
  }

  private patch<T = any>(
    request: Request,
    path: string,
    data?: any,
    config: AxiosRequestConfig = {},
  ) {
    const conf = this.mergeHeaders(request, config);
    return this.httpService.patch<T>(path, data, conf);
  }

  private delete<T = any>(
    request: Request,
    path: string,
    config: AxiosRequestConfig = {},
  ) {
    const conf = this.mergeHeaders(request, config);
    return this.httpService.delete<T>(path, conf);
  }
}
