import {
  InternalServerErrorException,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Request } from 'express';
import { GlobalAuthGuard } from '../auth/guards/global-auth.guard';
import { GQLRequest } from '../common/decorators/gql-request.decoractor';
import { CurrentUser } from '../common/decorators/user.decorator';
import EngineService from '../engine/engine.service';
import { ExtendUser } from './decorators/extend-user.decorator';
import { UpdateUserInput } from './inputs/update-user.input';
import { User } from './models/user.model';
import { UsersService } from './users.service';

@ExtendUser()
@UseGuards(GlobalAuthGuard)
@Resolver()
export class UsersResolver {
  private readonly logger = new Logger(UsersResolver.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly engineService: EngineService,
  ) {}

  @Query(() => User, { name: 'user' })
  /**
   * Return the user object
   * @param {User} user - User - This is the user object that is passed in from the decorator.
   * @returns The user object
   */
  async getUser(@CurrentUser() user: User) {
    if (!user || !user.id || !user.username)
      throw new InternalServerErrorException('User cannot be retrieve');

    return user;
  }

  /**
   * Update a user
   * @param {Request} request - The incoming request object.
   * @param {UpdateUserInput} updateUserInput - The input object that was passed to the mutation.
   * @param {User} user - The user that is currently logged in.
   * @returns The updated user.
   */
  @Mutation(() => User)
  async updateUser(
    @GQLRequest() request: Request,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUser() user?: User,
  ) {
    if (!user || !user.id || !user.username)
      throw new InternalServerErrorException('User cannot be retrieve');

    let updatedInfo: Partial<User>;

    if (this.engineService.has('updateUser')) {
      updatedInfo = await this.engineService.updateUser(
        request,
        user?.id,
        updateUserInput,
      );
    } else {
      const internalUser = await this.usersService.update(
        user.id,
        updateUserInput,
      );
      if (internalUser) Object.assign(user, internalUser);
    }

    if (updatedInfo) Object.assign(user, updatedInfo);

    return user;
  }
}
