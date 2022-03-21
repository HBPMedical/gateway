import { getMockReq } from '@jest-mock/express';
import { NotFoundException } from '@nestjs/common';
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

  const findOne = jest
    .fn()
    .mockResolvedValueOnce(internUserWrong)
    .mockResolvedValueOnce(internUserWrong)
    .mockImplementationOnce(() => {
      throw new NotFoundException();
    })
    .mockResolvedValue(internUser);

  const getActiveUser = jest
    .fn()
    .mockResolvedValueOnce(user)
    .mockResolvedValueOnce({})
    .mockResolvedValue(user);

  const engineService = {
    getActiveUser,
    updateUser: jest.fn().mockResolvedValue({ ...user, ...updateData }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersResolver],
    })
      .useMocker((token) => {
        if (token == UsersService) {
          return {
            findOne,
            update: jest.fn().mockResolvedValue({ ...user, ...internUser }),
          };
        }
        if (token == ENGINE_SERVICE) {
          return engineService;
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

  it('Get user with different id from engine and database', async () => {
    expect(await resolver.getUser(req, user)).toStrictEqual({
      ...user,
    });
  });

  it('Get user incomplete merge', async () => {
    expect(resolver.getUser(req, user)).rejects.toThrowError();
  });

  it('Get user not found in db', async () => {
    expect(await resolver.getUser(req, user)).toStrictEqual(user);
  });

  it('Get user in engine and database (merge)', async () => {
    expect(await resolver.getUser(req, user)).toStrictEqual({
      ...user,
      ...internUser,
    });
  });

  it('Update user from engine ', async () => {
    expect(await resolver.updateUser(req, updateData, user)).toStrictEqual({
      ...user,
      ...updateData,
    });
  });

  it('Update user from database', async () => {
    engineService.updateUser = undefined;
    expect(await resolver.updateUser(req, updateData, user)).toStrictEqual({
      ...user,
      ...internUser,
    });
  });
});
