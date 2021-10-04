import { HttpService } from '@nestjs/axios';
import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { firstValueFrom, map, Observable } from 'rxjs';
import { IEngineOptions, IEngineService } from 'src/engine/engine.interfaces';
import { Domain } from 'src/engine/models/domain.model';
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

export default class ExaremeService implements IEngineService {
  constructor(
    private readonly options: IEngineOptions,
    private readonly httpService: HttpService,
  ) {}

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

  async getExperiment(uuid: string): Promise<Experiment> {
    const path = this.options.baseurl + `experiments/${uuid}`;

    const resultAPI = await firstValueFrom(
      this.httpService.get<ExperimentData>(path),
    );

    return dataToExperiment(resultAPI.data);
  }

  async editExperient(
    uuid: string,
    expriment: ExperimentEditInput,
  ): Promise<Experiment> {
    const path = this.options.baseurl + `experiments/${uuid}`;

    const resultAPI = await firstValueFrom(
      this.httpService.patch<ExperimentData>(path, expriment),
    );

    return dataToExperiment(resultAPI.data);
  }

  async removeExperiment(uuid: string): Promise<PartialExperiment> {
    const path = this.options.baseurl + `experiments/${uuid}`;

    try {
      await firstValueFrom(this.httpService.delete(path));
      return {
        uuid: uuid,
      };
    } catch (error) {
      throw new BadRequestException(`${uuid} does not exists`);
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

  editActiveUser(request: Request): Observable<string> {
    const path = this.options.baseurl + 'activeUser/agreeNDA';

    return this.httpService
      .post<string>(path, request.body)
      .pipe(map((response) => response.data));
  }

  getExperimentAPI(uuid: string): Observable<string> {
    const path = this.options.baseurl + `experiments/${uuid}`;

    return this.httpService
      .get<string>(path)
      .pipe(map((response) => response.data));
  }

  deleteExperiment(uuid: string): Observable<string> {
    const path = this.options.baseurl + `experiments/${uuid}`;

    return this.httpService.delete(path).pipe(map((response) => response.data));
  }

  editExperimentAPI(uuid: string, request: Request): Observable<string> {
    const path = this.options.baseurl + `experiments/${uuid}`;

    return this.httpService
      .patch(path, request.body)
      .pipe(map((response) => response.data));
  }

  startExperimentTransient(request: Request): Observable<string> {
    const path = this.options.baseurl + 'experiments/transient';

    return this.httpService
      .post(path, request.body)
      .pipe(map((response) => response.data));
  }

  startExperiment(request: Request): Observable<string> {
    const path = this.options.baseurl + 'experiments';

    return this.httpService
      .post(path, request.body)
      .pipe(map((response) => response.data));
  }

  getExperiments(request: Request): Observable<string> {
    const path = this.options.baseurl + 'experiments';

    return this.httpService
      .get<string>(path, { params: request.query })
      .pipe(map((response) => response.data));
  }

  getAlgorithms(): Observable<string> {
    const path = this.options.baseurl + 'algorithms';

    return this.httpService
      .get<string>(path)
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
