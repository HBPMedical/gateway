import { User } from '../../../users/models/user.model';
import Connector, { RunResult } from '../../interfaces/connector.interface';
import { Domain } from '../../models/domain.model';
import { Algorithm } from '../../models/experiment/algorithm.model';

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

  async runExperiment(): Promise<RunResult> {
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
