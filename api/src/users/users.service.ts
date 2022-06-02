import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserInput } from './inputs/update-user.input';
import { User } from './models/user.model';

export type InternalUser = Pick<User, 'id' | 'agreeNDA'>;

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
    const user = await this.userRepository.findOne(id);

    if (!user) throw new NotFoundException(`User cannot be found in database.`);

    return user;
  }

  /**
   * Update a user
   * @param {string} id - The id of the user to update.
   * @param {UpdateUserInput} data - update params
   * @returns The updated user.
   */
  async update(id: string, data: UpdateUserInput): Promise<InternalUser> {
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
          `Extension of ${user.id} aborted, no user found in database`,
        );
    }
  }
}
