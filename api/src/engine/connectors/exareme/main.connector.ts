import { HttpService } from '@nestjs/axios';
import { Request } from 'express';
import { firstValueFrom, map, Observable } from 'rxjs';
import { Dictionary } from 'src/common/interfaces/utilities.interface';
import { IEngineOptions, IEngineService } from 'src/engine/engine.interfaces';
import { Domain } from 'src/engine/models/domain.model';
import { Group } from 'src/engine/models/group.model';
import { Hierarchy } from './interfaces/Hierarchy.interface';
import { Pathology } from './interfaces/pathology.interface';
import { VariableEntity } from './interfaces/variable-entity.interface';

export default class ExaremeService implements IEngineService {
  constructor(
    private readonly options: IEngineOptions,
    private readonly httpService: HttpService,
  ) { }

  private hierarchyToGroup = (data: Hierarchy): Group => {
    return {
      id: data.code,
      label: data.label,
      groups: data.groups ? data.groups.map((child: Hierarchy) => this.hierarchyToGroup(child)) : [],
      variables: []
    }
  }

  private flattenGroups = (data: Hierarchy): Group[] => {
    let groups: Group[] = [this.hierarchyToGroup(data)];

    if (data.groups) {
      groups = groups.concat(data.groups.flatMap(this.flattenGroups));
    }

    return groups;
  }


  async getDomain(): Promise<Domain[]> {
    const path = this.options.baseurl + 'pathologies';

    const data = await firstValueFrom(this.httpService.get(path));

    const domains = data.data.map((data: Pathology): Domain => {
      return {
        id: data.code,
        label: data.label,
        groups: data.metadataHierarchy.groups.flatMap(this.flattenGroups),
        datasets: [],
        variables: [],
      }
    })

    return domains;
  }

  demo(): string {
    return 'exareme';
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

  private pathologiesHierarchies = (
    json: Pathology[]
  ): Dictionary<Hierarchy> => {
    const pathologiesDatasets: Dictionary<Hierarchy> = {};
    json.forEach(pathology => {
      pathologiesDatasets[pathology.code] = pathology.metadataHierarchy;
    });

    return pathologiesDatasets;
  };

  private pathologiesVariables = (json: Pathology[]): Dictionary<VariableEntity[]> => {
    const pathologiesVariables: Dictionary<VariableEntity[]> = {};
    json.forEach(pathology => {
      let variables: VariableEntity[] = [];

      const dummyAccumulator = (node: any): void => {
        if (node.variables) {
          variables = [...variables, ...node.variables];
        }

        if (node.groups) {
          return node.groups.map(dummyAccumulator);
        }
      };

      if (pathology) {
        dummyAccumulator(pathology.metadataHierarchy);
      }

      pathologiesVariables[pathology.code] = variables;
    });

    return pathologiesVariables;
  };

  private pathologiesDatasets = (json: Pathology[]): Dictionary<VariableEntity[]> => {
    const pathologiesDatasets: Dictionary<VariableEntity[]> = {};
    json.forEach(pathology => {
      pathologiesDatasets[pathology.code] = pathology.datasets;
    });

    return pathologiesDatasets;
  };
}
