import { IEngineService } from 'src/engine/engine.interfaces';
import { Domain } from 'src/engine/models/domain.model';
import { Algorithm } from 'src/engine/models/experiment/algorithm.model';
import {
  Experiment,
  PartialExperiment,
} from 'src/engine/models/experiment/experiment.model';
import { ExperimentCreateInput } from 'src/engine/models/experiment/input/experiment-create.input';
import { ExperimentEditInput } from 'src/engine/models/experiment/input/experiment-edit.input';
import { ListExperiments } from 'src/engine/models/experiment/list-experiments.model';
import { User } from 'src/users/models/user.model';

export default class LocalService implements IEngineService {
  async login(): Promise<User> {
    return {
      id: '1',
      username: 'LocalServiceUser',
    };
  }

  async getAlgorithms(): Promise<Algorithm[]> {
    throw new Error('Method not implemented.');
  }

  async createExperiment(
    data: ExperimentCreateInput,
    isTransient: boolean,
  ): Promise<Experiment> {
    throw new Error('Method not implemented.');
  }

  async listExperiments(page: number, name: string): Promise<ListExperiments> {
    throw new Error('Method not implemented.');
  }

  async getExperiment(id: string): Promise<Experiment> {
    throw new Error('Method not implemented.');
  }

  async removeExperiment(id: string): Promise<PartialExperiment> {
    throw new Error('Method not implemented.');
  }

  async editExperient(
    id: string,
    expriment: ExperimentEditInput,
  ): Promise<Experiment> {
    throw new Error('Method not implemented.');
  }

  getDomains(): Domain[] {
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
