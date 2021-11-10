import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { firstValueFrom, map, Observable } from 'rxjs';
import { ENGINE_MODULE_OPTIONS } from 'src/engine/engine.constants';
import { IEngineOptions, IEngineService } from 'src/engine/engine.interfaces';
import { Domain } from 'src/engine/models/domain.model';
import { Algorithm } from 'src/engine/models/experiment/algorithm.model';
import {
  Experiment,
  PartialExperiment,
} from 'src/engine/models/experiment/experiment.model';
import { ExperimentCreateInput } from 'src/engine/models/experiment/input/experiment-create.input';
import { ExperimentEditInput } from 'src/engine/models/experiment/input/experiment-edit.input';
import { ListExperiments } from 'src/engine/models/experiment/list-experiments.model';
import { Group } from 'src/engine/models/group.model';
import { Variable } from 'src/engine/models/variable.model';
import {
  dataToAlgorithms,
  dataToCategory,
  dataToExperiment,
  dataToGroup,
  dataToVariable,
  experimentInputToData,
} from './converters';
import { ExperimentData } from './interfaces/experiment/experiment.interface';
import { ExperimentsData } from './interfaces/experiment/experiments.interface';
import { Hierarchy } from './interfaces/hierarchy.interface';
import { Pathology } from './interfaces/pathology.interface';

@Injectable()
export default class ExaremeService implements IEngineService {
  constructor(
    @Inject(ENGINE_MODULE_OPTIONS) private readonly options: IEngineOptions,
    private readonly httpService: HttpService,
    @Inject(REQUEST) private readonly req: Request,
  ) {}

  async logout() {
    const path = `${this.options.baseurl}logout`;

    await firstValueFrom(this.httpService.get(path));
  }

  async createExperiment(
    data: ExperimentCreateInput,
    isTransient = false,
  ): Promise<Experiment> {
    const form = experimentInputToData(data);

    const path =
      this.options.baseurl + `experiments${isTransient ? '/transient' : ''}`;

    const resultAPI = await firstValueFrom(
      this.httpService.post<ExperimentData>(path, form),
    );

    return dataToExperiment(resultAPI.data);
  }

  async listExperiments(page: number, name: string): Promise<ListExperiments> {
    const path = this.options.baseurl + 'experiments';

    const resultAPI = await firstValueFrom(
      this.httpService.get<ExperimentsData>(path, { params: { page, name } }),
    );

    return {
      ...resultAPI.data,
      experiments: resultAPI.data.experiments.map(dataToExperiment),
    };
  }

  async getAlgorithms(): Promise<Algorithm[]> {
    const path = this.options.baseurl + 'algorithms';

    const resultAPI = await firstValueFrom(this.httpService.get<string>(path));

    return dataToAlgorithms(resultAPI.data);
  }

  async getExperiment(id: string): Promise<Experiment> {
    const path = this.options.baseurl + `experiments/${id}`;

    const resultAPI = await firstValueFrom(
      this.httpService.get<ExperimentData>(path),
    );

    return dataToExperiment(resultAPI.data);
  }

  async editExperient(
    id: string,
    expriment: ExperimentEditInput,
  ): Promise<Experiment> {
    const path = this.options.baseurl + `experiments/${id}`;

    const resultAPI = await firstValueFrom(
      this.httpService.patch<ExperimentData>(path, expriment),
    );

    return dataToExperiment(resultAPI.data);
  }

  async removeExperiment(id: string): Promise<PartialExperiment> {
    const path = this.options.baseurl + `experiments/${id}`;

    try {
      await firstValueFrom(this.httpService.delete(path));
      return {
        id: id,
      };
    } catch (error) {
      throw new BadRequestException(`${id} does not exists`);
    }
  }

  async getDomains(ids: string[]): Promise<Domain[]> {
    const path = this.options.baseurl + 'pathologies';

    try {
      const data = await firstValueFrom(
        this.httpService.get<Pathology[]>(path),
      );

      return data.data
        .filter((data) => !ids || ids.length == 0 || ids.includes(data.code))
        .map((data): Domain => {
          const groups = this.flattenGroups(data.metadataHierarchy);

          return {
            id: data.code,
            label: data.label,
            groups: groups,
            rootGroup: dataToGroup(data.metadataHierarchy),
            datasets: data.datasets ? data.datasets.map(dataToCategory) : [],
            variables: data.metadataHierarchy
              ? this.flattenVariables(data.metadataHierarchy, groups)
              : [],
          };
        });
    } catch {
      throw new HttpException(
        `Connection to the engine ${this.options.type} failed`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  getActiveUser(): Observable<string> {
    const path = this.options.baseurl + 'activeUser';

    return this.httpService
      .get<string>(path)
      .pipe(map((response) => response.data));
  }

  editActiveUser(): Observable<string> {
    const path = this.options.baseurl + 'activeUser/agreeNDA';

    return this.httpService
      .post<string>(path, this.req.body)
      .pipe(map((response) => response.data));
  }

  getExperimentREST(id: string): Observable<string> {
    const path = this.options.baseurl + `experiments/${id}`;

    return this.httpService
      .get<string>(path)
      .pipe(map((response) => response.data));
  }

  deleteExperiment(id: string): Observable<string> {
    const path = this.options.baseurl + `experiments/${id}`;

    return this.httpService.delete(path).pipe(map((response) => response.data));
  }

  editExperimentREST(id: string): Observable<string> {
    const path = this.options.baseurl + `experiments/${id}`;

    return this.httpService
      .patch(path, this.req.body)
      .pipe(map((response) => response.data));
  }

  startExperimentTransient(): Observable<string> {
    const path = this.options.baseurl + 'experiments/transient';

    return this.httpService
      .post(path, this.req.body)
      .pipe(map((response) => response.data));
  }

  startExperiment(): Observable<string> {
    const path = this.options.baseurl + 'experiments';

    return this.httpService
      .post(path, this.req.body)
      .pipe(map((response) => response.data));
  }

  getExperiments(): Observable<string> {
    const path = this.options.baseurl + 'experiments';

    return this.httpService
      .get<string>(path, { params: this.req.query })
      .pipe(map((response) => response.data));
  }

  getAlgorithmsREST(): Observable<string> {
    const path = this.options.baseurl + 'algorithms';

    return this.httpService
      .get<string>(path, { params: this.req.query })
      .pipe(map((response) => response.data));
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
    const group = groups.find((group) => group.id == data.code);
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
}
