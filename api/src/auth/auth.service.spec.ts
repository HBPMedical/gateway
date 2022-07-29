import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';
import { ENGINE_MODULE_OPTIONS } from '../engine/engine.constants';
import { AuthService } from './auth.service';
import { User } from '../users/models/user.model';
import EngineService from '../engine/engine.service';
import authConfig from '../config/auth.config';

const moduleMocker = new ModuleMocker(global);

type MockEngineService = Partial<Record<keyof EngineService, jest.Mock>>;

const createEngineService = (): MockEngineService => ({
  login: jest.fn(),
  has: jest.fn(),
});

describe('AuthService', () => {
  let authService: AuthService;
  let engineService: MockEngineService;
  const user: User = {
    id: 'dummy',
    username: 'dummy64',
  };
  const jwtToken = 'JWTDummyToken';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: authConfig.KEY,
          useValue: authConfig(),
        },
        {
          provide: EngineService,
          useValue: createEngineService(),
        },
        {
          provide: ENGINE_MODULE_OPTIONS,
          useValue: {
            type: 'local',
            baseurl: 'test',
          },
        },
        AuthService,
      ],
    })
      .useMocker((token) => {
        if (token === JwtService) {
          return {
            sign: jest.fn().mockReturnValue(jwtToken),
          };
        }
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(
            token,
          ) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    authService = module.get<AuthService>(AuthService);
    engineService = module.get<EngineService>(
      EngineService,
    ) as unknown as MockEngineService;
  });

  it('login', async () => {
    const data = await authService.login(user);

    expect(data.accessToken).toBe(jwtToken);
  });

  it('validateUser', async () => {
    engineService.has.mockReturnValue(true);
    engineService.login.mockReturnValue({
      id: '1',
      username: 'dummy64',
    });
    const data = await authService.validateUser('guest', 'password123');

    expect(!!data).toBeTruthy();
  });
});
