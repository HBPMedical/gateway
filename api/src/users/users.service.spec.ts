import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';
import { UpdateUserInput } from './inputs/update-user.input';
import { User } from './models/user.model';
import { UsersService } from './users.service';

const moduleMocker = new ModuleMocker(global);

describe('UsersService', () => {
  let service: UsersService;
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
      providers: [UsersService],
    })
      .useMocker((token) => {
        if (token === getRepositoryToken(User)) {
          return {
            findOne: jest
              .fn()
              .mockResolvedValue(user)
              .mockResolvedValueOnce(undefined),
            save: jest.fn().mockResolvedValue({ ...user, ...updateData }), //todo
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

    service = module.get<UsersService>(UsersService);
  });

  it('getUser', async () => {
    expect(service.findOne('IdThatDoesNotExist')).rejects.toThrow();
    expect(await service.findOne('idThatExist')).toBe(user);
  });

  it('updateUser', async () => {
    expect(await service.update('idThatExist', updateData)).toStrictEqual({
      ...user,
      ...updateData,
    });
  });
});
