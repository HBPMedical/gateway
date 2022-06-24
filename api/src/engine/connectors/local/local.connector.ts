import Connector from 'src/engine/interfaces/connector.interface';
import { Domain } from 'src/engine/models/domain.model';
import { Algorithm } from 'src/engine/models/experiment/algorithm.model';
import { ResultUnion } from 'src/engine/models/result/common/result-union.model';
import { User } from 'src/users/models/user.model';

export default class LocalConnector implements Connector {
  async login(): Promise<User> {
    return {
      id: '1',
      username: 'LocalServiceUser',
    };
  }

  async getAlgorithms(): Promise<Algorithm[]> {
    throw new Error('Method not implemented.');
  }

  async runExperiment(): Promise<Array<typeof ResultUnion>> {
    throw new Error('Method not implemented.');
  }

  async getDomains(): Promise<Domain[]> {
    return [
      {
        id: 'Dummy',
        label: 'Dummy',
        datasets: [{ id: 'DummyDataset', label: 'DummyDataset' }],
        groups: [
          {
            id: 'DummyGroup',
            variables: ['DummyVar'],
            groups: [],
          },
        ],
        rootGroup: { id: 'DummyGroup' },
        variables: [{ id: 'DummyVar', type: 'string' }],
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