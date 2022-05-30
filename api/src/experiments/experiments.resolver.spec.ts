import { Test, TestingModule } from '@nestjs/testing';
import { ENGINE_SERVICE } from '../engine/engine.constants';
import { IEngineService } from '../engine/engine.interfaces';
import { ExperimentsResolver } from './experiments.resolver';
import { ExperimentsService } from './experiments.service';

const createEngineService = (): IEngineService => ({
  getDomains: jest.fn(),
  getAlgorithms: jest.fn(),
  createExperiment: jest.fn(),
  getExperiment: jest.fn(),
  editExperient: jest.fn(),
  listExperiments: jest.fn(),
});

const createExperimentsService = () => ({
  findAll: jest.fn(),
  findOne: jest.fn(),
  dataToExperiment: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
});

describe('ExperimentsResolver', () => {
  let resolver: ExperimentsResolver;
  let engineService: IEngineService;
  let experimentsService: ExperimentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExperimentsResolver,
        { provide: ExperimentsService, useValue: createExperimentsService() },
        {
          provide: ENGINE_SERVICE,
          useValue: createEngineService(),
        },
      ],
    }).compile();

    engineService = module.get<IEngineService>(ENGINE_SERVICE);
    experimentsService = module.get<ExperimentsService>(ExperimentsService);
    resolver = module.get<ExperimentsResolver>(ExperimentsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('experimentList', () => {
    describe('when engine method exist', () => {
      it('should call engine method', async () => {
        const request: any = jest.fn();
        await resolver.experimentList(0, '', request);

        expect(request).toBeDefined();
      });
    });
  });
});
