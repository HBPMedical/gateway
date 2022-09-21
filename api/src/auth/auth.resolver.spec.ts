import { getMockReq, getMockRes } from '@jest-mock/express';
import { ConfigType } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';
import authConfig from '../config/auth.config';
import { ENGINE_MODULE_OPTIONS } from '../engine/engine.constants';
import EngineService from '../engine/engine.service';
import { User } from '../users/models/user.model';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

const moduleMocker = new ModuleMocker(global);

describe('AuthResolver', () => {
  let resolver: AuthResolver;
  const { res } = getMockRes();
  const req: Request = getMockReq();
  const mockCookie = jest.fn();
  const mockClearCookie = jest.fn();
  let config: ConfigType<typeof authConfig>;

  res.cookie = mockCookie;
  res.clearCookie = mockClearCookie;

  const user: User = {
    id: 'testing',
    username: 'testing',
  };

  const authData = {
    accessToken: 'DummyToken',
  };

  const credentials = {
    username: 'guest',
    password: 'guest123',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: authConfig.KEY,
          useValue: authConfig(),
        },
        {
          provide: EngineService,
          useValue: {
            clearCache: jest.fn(),
          },
        },
        {
          provide: ENGINE_MODULE_OPTIONS,
          useValue: {
            type: 'DummyConnector',
          },
        },
        AuthResolver,
      ],
    })
      .useMocker((token) => {
        if (token === AuthService) {
          return {
            login: jest.fn().mockResolvedValue(authData),
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

    resolver = module.get<AuthResolver>(AuthResolver);
    config = module.get<ConfigType<typeof authConfig>>(authConfig.KEY);
  });

  it('login', async () => {
    const data = await resolver.login(res, req, user, credentials);

    expect(mockCookie.mock.calls[0][0]).toBe(config.cookie.name);
    expect(mockCookie.mock.calls[0][1]).toBe(authData.accessToken);
    expect(data.accessToken).toBe(authData.accessToken);
  });

  it('logout', async () => {
    const request: any = jest.fn();
    await resolver.logout(request, res, user);

    expect(mockClearCookie.mock.calls[0][0]).toBe(config.cookie.name);
  });
});
