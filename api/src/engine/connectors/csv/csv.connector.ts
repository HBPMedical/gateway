import { HttpService } from '@nestjs/axios';
import { NotImplementedException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { Dictionary } from '../../../common/interfaces/utilities.interface';
import Connector, {
  RunResult,
} from '../../../engine/interfaces/connector.interface';
import EngineOptions from '../../../engine/interfaces/engine-options.interface';
import { Domain } from '../../../engine/models/domain.model';
import { Algorithm } from '../../../engine/models/experiment/algorithm.model';
import { Group } from '../../../engine/models/group.model';
import { User } from '../../../users/models/user.model';

export default class CSVConnector implements Connector {
  constructor(
    private readonly options: EngineOptions,
    private readonly httpService: HttpService,
  ) {}

  async logout() {
    throw new NotImplementedException();
  }

  async getAlgorithms(): Promise<Algorithm[]> {
    throw new NotImplementedException();
  }

  async runExperiment(): Promise<RunResult> {
    throw new NotImplementedException();
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
        datasetsVariables: {
          DummyDataset: vars.map((v) => v.id),
        },
      },
    ];
  }

  async getActiveUser(): Promise<User> {
    return {
      username: 'anonymous',
      id: 'anonymousId',
      fullname: 'anonymous',
      email: 'anonymous@anonymous.com',
      agreeNDA: true,
    };
  }
}
