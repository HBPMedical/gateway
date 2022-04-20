import { getMockRes } from '@jest-mock/express';
import { Test, TestingModule } from '@nestjs/testing';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';
import LocalService from '../engine/connectors/local/main.connector';
import {
  ENGINE_MODULE_OPTIONS,
  ENGINE_SERVICE,
} from '../engine/engine.constants';
import { User } from '../users/models/user.model';
import { authConstants } from './auth-constants';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

const moduleMocker = new ModuleMocker(global);

describe('AuthResolver', () => {
  let resolver: AuthResolver;
  const { res } = getMockRes();
  const mockCookie = jest.fn();
  const mockClearCookie = jest.fn();

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
          provide: ENGINE_SERVICE,
          useClass: LocalService,
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
  });

  it('login', async () => {
    const data = await resolver.login(res, user, credentials);

    expect(mockCookie.mock.calls[0][0]).toBe(authConstants.cookie.name);
    expect(mockCookie.mock.calls[0][1]).toBe(authData.accessToken);
    expect(data.accessToken).toBe(authData.accessToken);
  });

  it('logout', () => {
    const request: any = jest.fn();
    resolver.logout(request, res, user);

    expect(mockClearCookie.mock.calls[0][0]).toBe(authConstants.cookie.name);
  });
});
