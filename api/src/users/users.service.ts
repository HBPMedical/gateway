import { Injectable, NotFoundException } from '@nestjs/common';
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

    return await this.userRepository.save(updateData);
  }
}
