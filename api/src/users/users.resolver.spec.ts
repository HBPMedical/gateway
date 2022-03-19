import { getMockReq } from '@jest-mock/express';
import { Test, TestingModule } from '@nestjs/testing';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';
import { ENGINE_SERVICE } from '../engine/engine.constants';
import { UpdateUserInput } from './inputs/update-user.input';
import { User } from './models/user.model';
import { UsersResolver } from './users.resolver';
import { InternalUser, UsersService } from './users.service';

const moduleMocker = new ModuleMocker(global);

describe('UsersResolver', () => {
  let resolver: UsersResolver;
  const req = getMockReq();
  const user: User = {
    id: 'guest',
    username: 'guest',
    fullname: 'This is la Peste',
  };

  const updateData: UpdateUserInput = {
    agreeNDA: true,
  };

  const internUser: InternalUser = {
    id: 'guest',
    agreeNDA: false,
  };

  const internUserWrong: InternalUser = {
    id: 'guest1',
    agreeNDA: false,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersResolver],
    })
      .useMocker((token) => {
        if (token == UsersService) {
          return {
            findOne: jest
              .fn()
              .mockResolvedValue(internUser)
              .mockResolvedValueOnce(internUserWrong),
            update: jest.fn().mockResolvedValue({ ...user, ...internUser }),
          };
        }
        if (token == ENGINE_SERVICE) {
          return {
            getActiveUser: jest.fn().mockResolvedValue(user),
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

    resolver = module.get<UsersResolver>(UsersResolver);
  });

  it('getUser', async () => {
    expect(await resolver.getUser(req, user)).toStrictEqual({
      ...user,
    });
    expect(await resolver.getUser(req, user)).toStrictEqual({
      ...user,
      ...internUser,
    });
  });

  it('updateUser', async () => {
    expect(await resolver.updateUser(req, updateData, user)).toBeDefined();
  });
});
