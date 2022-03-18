import { firstValueFrom } from 'rxjs';
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
import { User } from 'src/users/models/user.model';

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
    return {
      id: '',
      domain: '',
      datasets: [],
      algorithm: {
        id: '',
        description: '',
      },
      name: 'test',
      variables: [],
    };
  }

  listExperiments(
    page: number,
    name: string,
  ): ListExperiments | Promise<ListExperiments> {
    return {
      experiments: [],
      currentPage: 0,
      totalExperiments: 0,
      totalPages: 0,
    };
  }

  getExperiment(id: string): Experiment | Promise<Experiment> {
    throw new Error('Method not implemented.');
  }

  removeExperiment(id: string): PartialExperiment | Promise<PartialExperiment> {
    throw new Error('Method not implemented.');
  }

  editExperient(
    id: string,
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
      .filter((row) => row.length >= 1);

    rows.shift(); // remove headers

    const vars = [];
    const groups: Dictionary<Group> = {};
    const rootGroup: Group = {
      id: 'Global group',
      groups: [],
      variables: [],
    };

    rows.forEach((row) => {
      const variable = {
        id: row[0].toLowerCase(),
        label: row[0],
      };

      row.shift(); // get ride of the variable name, keep only groups

      if (!vars.find((v) => v.id === variable.id)) vars.push(variable); // avoid duplicate

      if (row.length < 1) {
        rootGroup.variables.push(variable.id);
        return;
      }

      let pathId = '';

      row.forEach((group, i) => {
        const groupId = `${pathId}/${group.toLowerCase()}`;
        pathId = groupId;
        if (groups[groupId]) return;
        if (i === 0) {
          rootGroup.groups.push(groupId);
        }
        groups[groupId] = {
          id: groupId,
          label: group,
          variables: [],
          groups: [],
        };
      });

      const groupId = pathId; // group's variable container

      groups[groupId].variables.push(variable.id); // add variable

      row // fill groups with childrens
        .reverse()
        .map((group) => group.toLowerCase())
        .forEach((group, i) => {
          const id = pathId;
          pathId = pathId.replace(`/${group}`, '');

          if (i !== row.length - 1) {
            const parentId = pathId;
            if (groups[parentId].groups.indexOf(id) === -1)
              groups[parentId].groups.push(id);
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

  getActiveUser(): User {
    const dummyUser = {
      username: 'anonymous',
      id: 'anonymousId',
      fullname: 'anonymous',
      email: 'anonymous@anonymous.com',
      agreeNDA: true,
    };
    return dummyUser;
  }

  getAlgorithmsREST(): string {
    return '[]';
  }
}
