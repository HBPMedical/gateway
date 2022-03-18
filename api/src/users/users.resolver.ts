import {
  Inject,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ENGINE_SERVICE } from '../engine/engine.constants';
import { IEngineService } from '../engine/engine.interfaces';
import { CurrentUser } from '../auth/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateUserInput } from './inputs/update-user.input';
import { User } from './models/user.model';
import { UsersService } from './users.service';
import { GQLRequest } from '../common/decorators/gql-request.decoractor';
import { Request } from 'express';

@UseGuards(JwtAuthGuard)
@Resolver()
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    @Inject(ENGINE_SERVICE) private readonly engineService: IEngineService,
  ) {}

  @Query(() => User, { name: 'user' })
  getUser(@GQLRequest() request: Request, @CurrentUser() reqUser: User): User {
    const user: Partial<User> = {};

    if (this.engineService.getActiveUser) {
      const engineUser = this.engineService.getActiveUser(request);
      if (engineUser) Object.assign(user, engineUser);
    }

    const internalUser = this.usersService.getUser(reqUser.id);

    if (internalUser) {
      Object.assign(user, internalUser);
    }

    if (!user.id || !user.username)
      throw new InternalServerErrorException(
        'The user cannot be construct from the engine ',
      );

    return user as User;
  }

  @Mutation(() => User)
  updateUser(
    @GQLRequest() request: Request,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUser() user: User,
  ) {
    if (this.engineService.updateUser)
      return this.engineService.updateUser(request, updateUserInput);

    return this.usersService.updateUser(user.id, updateUserInput);
  }
}
