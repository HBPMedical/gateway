import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';
import LocalService from '../engine/connectors/local/main.connector';
import {
  ENGINE_MODULE_OPTIONS,
  ENGINE_SERVICE,
} from '../engine/engine.constants';
import { AuthService } from './auth.service';
import { User } from '../users/models/user.model';

const moduleMocker = new ModuleMocker(global);

describe('AuthService', () => {
  let service: AuthService;
  const user: User = {
    id: 'dummy',
    username: 'dummy64',
  };
  const jwtToken = 'JWTDummyToken';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ENGINE_SERVICE,
          useClass: LocalService,
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

    service = module.get<AuthService>(AuthService);
  });

  it('login', async () => {
    const data = await service.login(user);

    expect(data.accessToken).toBe(jwtToken);
  });

  it('validateUser', async () => {
    const data = await service.validateUser('guest', 'password123');

    expect(!!data).toBeTruthy();
  });
});
