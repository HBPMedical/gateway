import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserInput } from './inputs/update-user.input';
import { User } from './models/user.model';

type InternalUser = Pick<User, 'id' | 'agreeNDA'>;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<InternalUser>,
  ) {}

  getUser(id: string): InternalUser {
    //return local informations NDA

    return {
      id,
    };
  }

  async updateUser(id: string, data: UpdateUserInput): Promise<InternalUser> {
    const user = await this.userRepository.preload({
      id,
      ...data,
    });

    return this.userRepository.save(user);
  }
}
