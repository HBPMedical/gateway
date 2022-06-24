import { Test, TestingModule } from '@nestjs/testing';
import EngineService from '../engine/engine.service';
import { ExperimentStatus } from '../engine/models/experiment/experiment.model';
import { User } from '../users/models/user.model';
import { ExperimentsResolver } from './experiments.resolver';
import { ExperimentsService } from './experiments.service';
import { ExperimentCreateInput } from './models/input/experiment-create.input';
import { ExperimentEditInput } from './models/input/experiment-edit.input';

type MockEngineService = Partial<Record<keyof EngineService, jest.Mock>>;
type MockExperimentService = Partial<
  Record<keyof ExperimentsService, jest.Mock>
>;

const createEngineService = (): MockEngineService => ({
  getDomains: jest.fn(),
  getAlgorithms: jest.fn(),
  createExperiment: jest.fn(),
  runExperiment: jest.fn(),
  getExperiment: jest.fn(),
  editExperiment: jest.fn(),
  listExperiments: jest.fn(),
  removeExperiment: jest.fn(),
  has: jest.fn().mockReturnValue(true),
});

const createExperimentsService = (): MockExperimentService => ({
  findAll: jest.fn(),
  findOne: jest.fn(),
  dataToExperiment: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
});

describe('ExperimentsResolver', () => {
  let resolver: ExperimentsResolver;
  let engineService: MockEngineService;
  let experimentsService: MockExperimentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExperimentsResolver,
        { provide: ExperimentsService, useValue: createExperimentsService() },
        {
          provide: EngineService,
          useValue: createEngineService(),
        },
      ],
    }).compile();

    engineService = module.get<EngineService>(
      EngineService,
    ) as unknown as MockEngineService;
    experimentsService = module.get<ExperimentsService>(
      ExperimentsService,
    ) as unknown as MockExperimentService;
    resolver = module.get<ExperimentsResolver>(ExperimentsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('experimentList', () => {
    describe('when engine method exist', () => {
      it('should call engine method', async () => {
        const request: any = jest.fn();
        engineService.listExperiments.mockReturnValue({});
        await resolver.experimentList(0, '', request);

        expect(engineService.listExperiments.mock.calls.length).toBeGreaterThan(
          0,
        );
      });
    });

    describe('when engine method does not exist', () => {
      it('should call service method', async () => {
        const request: any = jest.fn();
        engineService.has.mockReturnValue(false);
        experimentsService.findAll.mockReturnValue([[], 9]);
        await resolver.experimentList(0, '', request);

        expect(experimentsService.findAll.mock.calls.length).toBeGreaterThan(0);
      });
    });
  });

  describe('experiment', () => {
    describe('when engine method exist', () => {
      it('should call engine method', async () => {
        const request: any = jest.fn();
        const user: User = {
          id: 'dummyUser',
          username: 'test',
        };
        await resolver.experiment('test', request, user);

        expect(experimentsService.findOne.mock.calls.length).toBe(0);
        expect(engineService.getExperiment.mock.calls.length).toBeGreaterThan(
          0,
        );
      });
    });

    describe('when engine method does not exist', () => {
      it('should call service method', async () => {
        const request: any = jest.fn();
        const user: User = {
          id: 'dummyUser',
          username: 'test',
        };
        engineService.has.mockReturnValue(false);
        await resolver.experiment('test', request, user);

        expect(experimentsService.findOne.mock.calls.length).toBeGreaterThan(0);
      });
    });
  });

  describe('createExperiment', () => {
    describe('when engine method exist', () => {
      it('should call engine method', async () => {
        const request: any = jest.fn();
        const data: ExperimentCreateInput =
          {} as unknown as ExperimentCreateInput;
        const user: User = {
          id: 'dummyUser',
          username: 'test',
        };
        await resolver.createExperiment(request, user, data, true);

        expect(experimentsService.create.mock.calls.length).toBe(0);
        expect(
          engineService.createExperiment.mock.calls.length,
        ).toBeGreaterThan(0);
      });
    });

    describe('when engine method does not exist', () => {
      it('should call service method', async () => {
        const request: any = jest.fn();
        const data: ExperimentCreateInput =
          {} as unknown as ExperimentCreateInput;
        const user: User = {
          id: 'dummyUser',
          username: 'test',
        };
        engineService.has.mockReturnValue(false);
        engineService.runExperiment.mockResolvedValue([]);
        experimentsService.create.mockReturnValue({ id: 'test' });
        await resolver.createExperiment(request, user, data, false);

        expect(experimentsService.create.mock.calls.length).toBeGreaterThan(0);
      });

      it('should only call runExperiment if transient', async () => {
        const request: any = jest.fn();
        const data: ExperimentCreateInput =
          {} as unknown as ExperimentCreateInput;
        const user: User = {
          id: 'dummyUser',
          username: 'test',
        };
        engineService.has.mockReturnValue(false);
        engineService.runExperiment.mockResolvedValue([]);
        experimentsService.create.mockReturnValue({ id: 'test' });
        const result = await resolver.createExperiment(
          request,
          user,
          data,
          true,
        );

        expect(engineService.runExperiment.mock.calls.length).toBeGreaterThan(
          0,
        );
        expect(result.status).toBe(ExperimentStatus.SUCCESS);
      });
    });
  });

  describe('editExperiment', () => {
    describe('when engine method exist', () => {
      it('should call engine method', async () => {
        const request: any = jest.fn();
        const data: ExperimentEditInput = {} as unknown as ExperimentEditInput;
        const user: User = {
          id: 'dummyUser',
          username: 'test',
        };
        await resolver.editExperiment(request, 'test', data, user);

        expect(experimentsService.update.mock.calls.length).toBe(0);
        expect(engineService.editExperiment.mock.calls.length).toBeGreaterThan(
          0,
        );
      });
    });

    describe('when engine method does not exist', () => {
      it('should call service method', async () => {
        const request: any = jest.fn();
        const data: ExperimentEditInput = {} as unknown as ExperimentEditInput;
        const user: User = {
          id: 'dummyUser',
          username: 'test',
        };
        engineService.has.mockReturnValue(false);
        await resolver.editExperiment(request, 'test', data, user);

        expect(experimentsService.update.mock.calls.length).toBeGreaterThan(0);
      });
    });
  });

  describe('removeExperiment', () => {
    describe('when engine method exist', () => {
      it('should call engine method', async () => {
        const request: any = jest.fn();
        const user: User = {
          id: 'dummyUser',
          username: 'test',
        };
        await resolver.removeExperiment('test', request, user);

        expect(experimentsService.remove.mock.calls.length).toBe(0);
        expect(
          engineService.removeExperiment.mock.calls.length,
        ).toBeGreaterThan(0);
      });
    });

    describe('when engine method does not exist', () => {
      it('should call service method', async () => {
        const request: any = jest.fn();
        const user: User = {
          id: 'dummyUser',
          username: 'test',
        };
        engineService.has.mockReturnValue(false);
        await resolver.removeExperiment('test', request, user);

        expect(experimentsService.remove.mock.calls.length).toBeGreaterThan(0);
      });
    });
  });
});
