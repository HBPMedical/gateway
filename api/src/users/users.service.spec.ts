import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserInput } from './inputs/update-user.input';
import { User } from './models/user.model';
import { UsersService } from './users.service';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const createMockRepository = <T = any>(): MockRepository<T> => ({
  findOne: jest.fn(),
  save: jest.fn(),
});

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: MockRepository;
  const user: User = {
    id: 'guest',
    username: 'guest',
    agreeNDA: false,
  };

  const updateData: UpdateUserInput = {
    agreeNDA: true,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: createMockRepository<User>(),
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get<MockRepository>(getRepositoryToken(User));
  });

  describe('getUser', () => {
    describe('when user exist', () => {
      it('Should return a user', async () => {
        usersRepository.findOne.mockReturnValue(user);
        const result = await service.findOne('idThatExist');

        expect(result).toStrictEqual(user);
      });
    });

    describe('otherwise', () => {
      it('Should return a NotFoundException', async () => {
        usersRepository.findOne.mockReturnValue(undefined);

        try {
          await service.findOne('IdThatDoesNotExist');
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
        }
      });
    });
  });

  describe('updateUser', () => {
    it('should return an updated user', async () => {
      const expectedUser = { ...user, ...updateData };
      usersRepository.save.mockResolvedValue(expectedUser);

      const result = await service.update('idThatExist', updateData);

      expect(result).toStrictEqual(expectedUser);
    });
  });

  describe('extendedUser', () => {
    it('should return an extended user', async () => {
      const localUser: User = {
        id: 'dummyId',
        username: 'dummyUsername',
      };

      const expectedUser = {
        ...localUser,
        agreeNDA: true,
      };

      usersRepository.findOne.mockReturnValue(expectedUser);

      await service.extendedUser(localUser);

      expect(localUser).toStrictEqual(expectedUser);
    });
  });
});
