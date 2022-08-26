import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/models/user.model';
import { Repository } from 'typeorm';
import { Experiment } from '../engine/models/experiment/experiment.model';
import { ExperimentsService } from './experiments.service';
import { ExperimentCreateInput } from './models/input/experiment-create.input';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
  findOneBy: jest.fn(),
  findOne: jest.fn(),
  findAndCount: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
  update: jest.fn(),
});

describe('ExperimentsService', () => {
  let service: ExperimentsService;
  let experimentRepository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExperimentsService,
        {
          provide: getRepositoryToken(Experiment),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<ExperimentsService>(ExperimentsService);
    experimentRepository = module.get<MockRepository>(
      getRepositoryToken(Experiment),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    describe('when experiment with ID exists', () => {
      it('should return the experiment object', async () => {
        const experimentId = '1';
        const expectedExperiment = {};

        experimentRepository.findOneBy.mockReturnValue(expectedExperiment);
        const experiment = await service.findOne(experimentId);
        expect(experiment).toEqual(expectedExperiment);
      });
      it('should throw an error if user does not match ', async () => {
        const experimentId = '1';
        const expectedExperiment = {
          author: {
            username: 'differentUsername',
          },
        };
        const user: User = {
          username: 'test',
          id: 'dummyid',
        };

        experimentRepository.findOneBy.mockReturnValue(expectedExperiment);

        try {
          await service.findOne(experimentId, user);
        } catch (err) {
          expect(err).toBeInstanceOf(ForbiddenException);
        }
      });
    });
    describe('otherwise', () => {
      it('should throw the "NotFoundException"', async () => {
        const experimentId = '1';
        experimentRepository.findOneBy.mockReturnValue(undefined);

        try {
          await service.findOne(experimentId);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(`Experiment #${experimentId} not found`);
        }
      });
    });
  });

  describe('findAll', () => {
    describe('Should return a list of experiments', () => {
      it('should return the experiment object', async () => {
        const excpectedList = [{}, {}, {}];
        const expectedOutput = [excpectedList, excpectedList.length];

        experimentRepository.findAndCount.mockReturnValue(expectedOutput);
        const [experimentList, count] = await service.findAll();
        expect(count).toEqual(excpectedList.length);
        expect(experimentList).toStrictEqual(excpectedList);
      });
    });
  });

  describe('create', () => {
    it('Should return an experiment', async () => {
      const data: ExperimentCreateInput = {
        domain: 'dummyDomain',
        variables: [],
        algorithm: {
          id: 'dummyAlgo',
          parameters: [],
        },
        datasets: ['dummyDataset'],
        filter: '',
        name: 'dummyExperiment',
      };
      const user: User = {
        id: 'userId',
        username: 'username',
      };

      const expectedExperiment: Experiment = {
        ...data,
        author: {
          fullname: user.username,
          username: user.username,
        },
        algorithm: {
          name: data.algorithm.id,
          parameters: [],
        },
        id: 'dummyid',
      };

      experimentRepository.create.mockReturnValue(expectedExperiment);
      const experiment = await experimentRepository.create(data, user);

      expect(experiment).toStrictEqual(expectedExperiment);
    });
  });

  describe('update', () => {
    it('should return updated experiment', async () => {
      const user: User = {
        id: 'userId',
        username: 'username',
      };
      const expectedExperiment: Experiment = {
        domain: 'dummyDomain',
        variables: [],
        datasets: ['dummyDataset'],
        filter: '',
        name: 'dummyExperiment',
        author: {
          fullname: user.username,
          username: user.username,
        },
        algorithm: {
          name: 'dummyAlgo',
          parameters: [],
        },
        id: 'dummyid',
      };

      const updateData = { name: 'test' };

      experimentRepository.findOneBy.mockReturnValue({
        author: {
          ...user,
        },
      });
      experimentRepository.save.mockReturnValue(expectedExperiment);

      const experiment = await service.update(
        expectedExperiment.id,
        updateData,
        user,
      );

      expect(experiment).toStrictEqual(expectedExperiment);
    });
  });
});
