import { Injectable } from '@nestjs/common';
import { User } from './models/user.model';

@Injectable()
export class UsersService {
  getCurrentUser(): Partial<User> {
    //return local informations

    return {
      id: 'test',
      username: 'test',
    };
  }
}
