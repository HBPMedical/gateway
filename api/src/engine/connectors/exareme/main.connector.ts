import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { firstValueFrom, map, Observable } from 'rxjs';
import { IEngineOptions, IEngineService } from 'src/engine/engine.interfaces';
import { Domain } from 'src/engine/models/domain.model';
import { Group } from 'src/engine/models/group.model';
import { ExperimentCreateInput } from 'src/engine/models/experiment/experiment-create.input';
import { Experiment } from 'src/engine/models/experiment/experiment.model';
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

    const result = {
      name: 'Descriptive statistics',
      result: [
        {
          data: {
            single: {
              'Left inferior temporal gyrus': {
                ppmi: {
                  data: {
                    std: 1.2048783713787277,
                    min: 7.6335,
                    mean: 11.38076218487395,
                  },
                  num_datapoints: 714,
                  num_total: 714,
                  num_nulls: 0,
                },
                edsd: {
                  data: {
                    std: 1.3274694970555183,
                    max: 14.593,
                    min: 5.4301,
                    mean: 10.647539816933637,
                  },
                  num_datapoints: 437,
                  num_total: 474,
                  num_nulls: 37,
                },
                'desd-synthdata': {
                  data: {
                    std: 1.3479276642860987,
                    max: 14.593,
                    min: 5.4301,
                    mean: 10.685619565217392,
                  },
                  num_datapoints: 920,
                  num_total: 1000,
                  num_nulls: 80,
                },
              },
              'Left posterior insula': {
                ppmi: {
                  data: {
                    std: 0.25046887396228024,
                    max: 3.0882,
                    min: 1.7073,
                    mean: 2.358402521008403,
                  },
                  num_datapoints: 714,
                  num_total: 714,
                  num_nulls: 0,
                },
                edsd: {
                  data: {
                    std: 0.2716090949138581,
                    max: 3.1971,
                    min: 1.2675,
                    mean: 2.2726512585812357,
                  },
                  num_datapoints: 437,
                  num_total: 474,
                  num_nulls: 37,
                },
                'desd-synthdata': {
                  data: {
                    std: 0.2619310561946756,
                    max: 3.1971,
                    min: 1.2675,
                    mean: 2.27014597826087,
                  },
                  num_datapoints: 920,
                  num_total: 1000,
                  num_nulls: 80,
                },
              },
            },
            model: {
              ppmi: {
                num_datapoints: 714,
                data: {
                  'Left inferior temporal gyrus': {
                    std: 1.2048783713787277,
                    max: 15.0815,
                    min: 7.6335,
                    mean: 11.38076218487395,
                  },
                  'Left posterior insula': {
                    std: 0.25046887396228024,
                    max: 3.0882,
                    min: 1.7073,
                    mean: 2.358402521008403,
                  },
                },
                num_total: 714,
                num_nulls: 0,
              },
              edsd: {
                num_datapoints: 437,
                data: {
                  'Left inferior temporal gyrus': {
                    std: 1.3274694970555183,
                    max: 14.593,
                    min: 5.4301,
                    mean: 10.647539816933637,
                  },
                  'Left posterior insula': {
                    std: 0.2716090949138581,
                    max: 3.1971,
                    min: 1.2675,
                    mean: 2.2726512585812357,
                  },
                },
                num_total: 474,
                num_nulls: 37,
              },
              'desd-synthdata': {
                num_datapoints: 920,
                data: {
                  'Left inferior temporal gyrus': {
                    std: 1.3479276642860987,
                    max: 14.593,
                    min: 5.4301,
                    mean: 10.685619565217392,
                  },
                  'Left posterior insula': {
                    std: 0.2619310561946756,
                    max: 3.1971,
                    min: 1.2675,
                    mean: 2.27014597826087,
                  },
                },
                num_total: 1000,
                num_nulls: 80,
              },
            },
          },
        },
      ],
    } as TransientDataResult;

    /*= await firstValueFrom(
      this.httpService.post<TransientDataResult>(path, form),
    );*/

    return dataToTransient(result);
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
