import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { firstValueFrom, map, Observable } from 'rxjs';
import { IEngineOptions, IEngineService } from 'src/engine/engine.interfaces';
import { Domain } from 'src/engine/models/domain.model';
import { ExperimentCreateInput } from 'src/engine/models/experiment/experiment-create.input';
import { Experiment } from 'src/engine/models/experiment/experiment.model';
import { Group } from 'src/engine/models/group.model';
import { Variable } from 'src/engine/models/variable.model';
import {
  dataToCategory,
  dataToGroup,
  dataToTransient,
  dataToVariable,
  experimentInputToData,
} from './converters';
import { Hierarchy } from './interfaces/hierarchy.interface';
import { Pathology } from './interfaces/pathology.interface';
import { TransientDataResult } from './interfaces/transient/transient-data-result.interface';

export default class ExaremeService implements IEngineService {
  constructor(
    private readonly options: IEngineOptions,
    private readonly httpService: HttpService,
  ) {}

  async createTransient(data: ExperimentCreateInput): Promise<Experiment> {
    const form = experimentInputToData(data);

    const path = this.options.baseurl + 'experiments/transient';

    const resultAPI = await firstValueFrom(
      this.httpService.post<TransientDataResult>(path, form),
    );

    return dataToTransient(resultAPI.data);
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

  getExperiment(uuid: string): Observable<string> {
    const path = this.options.baseurl + `experiments/${uuid}`;

    return this.httpService
      .get<string>(path)
      .pipe(map((response) => response.data));
  }

  deleteExperiment(uuid: string): Observable<string> {
    const path = this.options.baseurl + `experiments/${uuid}`;

    return this.httpService.delete(path).pipe(map((response) => response.data));
  }

  editExperiment(uuid: string, request: Request): Observable<string> {
    const path = this.options.baseurl + `experiments/${uuid}`;

    return this.httpService
      .post(path, request.body)
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

  getExperiments(): Observable<string> {
    const path = this.options.baseurl + 'experiments';

    return this.httpService
      .get<string>(path)
      .pipe(map((response) => response.data));
  }

  getAlgorithms(): Observable<string> {
    const path = this.options.baseurl + 'algorithms';

    return this.httpService
      .get<string>(path)
      .pipe(map((response) => response.data));
  }

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
