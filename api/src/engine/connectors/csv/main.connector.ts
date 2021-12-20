import { firstValueFrom, Observable } from 'rxjs';
import { IEngineOptions, IEngineService } from 'src/engine/engine.interfaces';
import { Domain } from 'src/engine/models/domain.model';
import { ExperimentCreateInput } from 'src/engine/models/experiment/input/experiment-create.input';
import {
  Experiment,
  PartialExperiment,
} from 'src/engine/models/experiment/experiment.model';
import { ListExperiments } from 'src/engine/models/experiment/list-experiments.model';
import { ExperimentEditInput } from 'src/engine/models/experiment/input/experiment-edit.input';
import { Algorithm } from 'src/engine/models/experiment/algorithm.model';
import { HttpService } from '@nestjs/axios';
import { Group } from 'src/engine/models/group.model';
import { Dictionary } from 'src/common/interfaces/utilities.interface';

export default class CSVService implements IEngineService {
  constructor(
    private readonly options: IEngineOptions,
    private readonly httpService: HttpService,
  ) {}

  logout() {
    throw new Error('Method not implemented.');
  }

  getAlgorithms(): Algorithm[] | Promise<Algorithm[]> {
    throw new Error('Method not implemented.');
  }

  createExperiment(
    data: ExperimentCreateInput,
    isTransient: boolean,
  ): Experiment | Promise<Experiment> {
    throw new Error('Method not implemented.');
  }

  listExperiments(
    page: number,
    name: string,
  ): ListExperiments | Promise<ListExperiments> {
    throw new Error('Method not implemented.');
  }

  getExperiment(uuid: string): Experiment | Promise<Experiment> {
    throw new Error('Method not implemented.');
  }

  removeExperiment(
    uuid: string,
  ): PartialExperiment | Promise<PartialExperiment> {
    throw new Error('Method not implemented.');
  }

  editExperient(
    uuid: string,
    expriment: ExperimentEditInput,
  ): Experiment | Promise<Experiment> {
    throw new Error('Method not implemented.');
  }

  async getDomains(): Promise<Domain[]> {
    const path = this.options.baseurl;

    const { data } = await firstValueFrom(this.httpService.get<string>(path));

    const rows = data
      .split('\r\n')
      .map((row) => row.split('\t').filter((i) => i))
      .filter((row) => row.length >= 2);

    rows.shift(); // remove headers

    const vars = [];
    const groups: Dictionary<Group> = {};
    const rootGroup: Group = {
      id: 'Global group',
      groups: [],
    };

    rows.forEach((row) => {
      const variable = {
        id: row[0].toLowerCase(),
        label: row[0],
      };

      row.shift(); // get ride of the variable name, keep only groups

      vars.push(variable);

      row
        .filter((group) => !groups[group.toLowerCase()])
        .forEach((group, i) => {
          const groupId = group.toLowerCase();
          if (i === 0) rootGroup.groups.push(groupId);
          groups[groupId] = {
            id: groupId,
            label: group,
            variables: [],
            groups: [],
          };
        });

      const groupId = row[row.length - 1].toLowerCase(); // group's variable container

      groups[groupId].variables.push(variable.id); // add variable

      row
        .reverse()
        .map((group) => group.toLowerCase())
        .forEach((group, i) => {
          const groupId = group.toLowerCase();

          if (i !== row.length - 1) {
            const parentId = row[i + 1].toLowerCase();
            if (groups[parentId].groups.indexOf(groupId) === -1)
              groups[parentId].groups.push(groupId);
          }
        });
    });

    rootGroup.groups = [...new Set(rootGroup.groups)]; // get distinct values

    return [
      {
        id: 'Dummy',
        label: 'Dummy',
        datasets: [{ id: 'DummyDataset', label: 'Dummy Dataset' }],
        groups: Object.values(groups),
        rootGroup: rootGroup,
        variables: vars,
      },
    ];
  }

  getActiveUser(): string {
    const dummyUser = {
      username: 'anonymous',
      subjectId: 'anonymousId',
      fullname: 'anonymous',
      email: 'anonymous@anonymous.com',
      agreeNDA: true,
    };
    return JSON.stringify(dummyUser);
  }

  editActiveUser(): Observable<string> {
    throw new Error('Method not implemented.');
  }

  getExperimentREST(): Observable<string> {
    throw new Error('Method not implemented.');
  }

  deleteExperiment(): Observable<string> {
    throw new Error('Method not implemented.');
  }

  editExperimentREST(): Observable<string> {
    throw new Error('Method not implemented.');
  }

  startExperimentTransient(): Observable<string> {
    throw new Error('Method not implemented.');
  }

  startExperiment(): Observable<string> {
    throw new Error('Method not implemented.');
  }

  getExperiments(): string {
    return '[]';
  }

  getAlgorithmsREST(): string {
    return '[]';
  }
}
