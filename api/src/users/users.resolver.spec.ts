import { getMockReq } from '@jest-mock/express';
import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ENGINE_SERVICE } from '../engine/engine.constants';
import { IEngineService } from '../engine/engine.interfaces';
import { UpdateUserInput } from './inputs/update-user.input';
import { User } from './models/user.model';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

type MockEngineService = Partial<Record<keyof IEngineService, jest.Mock>>;
type MockUsersService = Partial<Record<keyof UsersService, jest.Mock>>;

const createEngineService = (): MockEngineService => ({
  updateUser: jest.fn(),
});

const createUsersService = (): MockUsersService => ({
  update: jest.fn(),
});

describe('UsersResolver', () => {
  let resolver: UsersResolver;
  const req = getMockReq();
  let engineService: MockEngineService;
  let usersService: MockUsersService;

  const user: User = {
    id: 'guest',
    username: 'guest',
    fullname: 'This is la Peste',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersResolver,
        { provide: UsersService, useValue: createUsersService() },
        {
          provide: ENGINE_SERVICE,
          useValue: createEngineService(),
        },
      ],
    }).compile();

    resolver = module.get<UsersResolver>(UsersResolver);
    engineService = module.get<MockEngineService>(ENGINE_SERVICE);
    usersService = module.get<UsersService>(
      UsersService,
    ) as unknown as MockUsersService;
  });

  describe('getUser', () => {
    it('Get simple user', async () => {
      const excpectedUser: User = {
        id: 'guest',
        username: 'guest',
        fullname: 'This is la Peste',
      };
      const result = await resolver.getUser(excpectedUser);
      expect(result).toStrictEqual(excpectedUser);
    });

    it('Undefined user should throw an InternalServerErrorException', async () => {
      try {
        await resolver.getUser(undefined);
      } catch (err) {
        expect(err).toBeInstanceOf(InternalServerErrorException);
      }
    });
  });

  describe('updateUser', () => {
    it('Update user from engine ', async () => {
      const updateData: UpdateUserInput = {
        agreeNDA: true,
      };
      const expectedUser = {
        ...user,
        ...updateData,
      };

      engineService.updateUser.mockReturnValue(expectedUser);
      const result = await resolver.updateUser(req, updateData, user);

      expect(result).toStrictEqual(expectedUser);
    });

    it('Update user from database', async () => {
      const updateData: UpdateUserInput = {
        agreeNDA: true,
      };
      const expectedUser = {
        ...user,
        ...updateData,
      };

      engineService.updateUser = undefined;
      usersService.update.mockReturnValue(expectedUser);
      const result = await resolver.updateUser(req, updateData, user);

      expect(result).toStrictEqual(expectedUser);
    });

    it('Undefined user should throw an exception', async () => {
      try {
        await resolver.updateUser(req, {});
      } catch (err) {
        expect(err).toBeInstanceOf(InternalServerErrorException);
      }
    });
  });
});
