import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { UpdateUserInput } from './inputs/update-user.input';
import { User } from './models/user.model';

export type InternalUser = Pick<User, 'id' | 'agreeNDA' | 'refreshToken'>;
export type UserDataUpdate = Partial<
  Pick<User, 'agreeNDA' | 'refreshToken'> | UpdateUserInput
>;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<InternalUser>,
  ) {}

  private readonly logger = new Logger(UsersService.name);

  /**
   * Get a user by id
   * @param {string} id - The id of the user to be retrieved.
   * @returns The user object.
   */
  async findOne(id: string): Promise<InternalUser> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) throw new NotFoundException(`User cannot be found in database.`);

    return user;
  }

  /**
   * Update a user
   * @param {string} id - The id of the user to update.
   * @param {UserDataUpdate} data - update params
   * @returns The updated user.
   */
  async update(id: string, data: UserDataUpdate): Promise<UpdateResult> {
    return this.userRepository.update({ id }, data);
  }

  /**
   * Saves user in the database.
   * If user does not exist in the database then inserts, otherwise updates.
   * @param {string} id - The id of the user to update.
   * @param {UserDataUpdate} data - update params
   * @returns The updated user.
   */
  async save(id: string, data: UserDataUpdate): Promise<InternalUser> {
    const updateData = {
      id,
      ...data,
    };

    return this.userRepository.save(updateData);
  }

  /**
   * It takes a user object, checks if it has an id, and if it does, it tries to find the user in the
   * database and then merges the database user with the user object
   * @param {User} user - User - The user object that is being extended.
   */
  async extendedUser(user: User) {
    if (!user || !user.id) {
      return;
    }

    try {
      const dbUser = await this.findOne(user.id);

      Object.assign(user, dbUser);
    } catch (err) {
      if (err instanceof NotFoundException)
        this.logger.debug(
          `Extension of ${user.id} not needed, user not found in database`,
        );
    }
  }
}
