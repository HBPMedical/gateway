import {
  Inject,
  InternalServerErrorException,
  Logger,
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
  private readonly logger = new Logger(UsersResolver.name);

  constructor(
    private readonly usersService: UsersService,
    @Inject(ENGINE_SERVICE) private readonly engineService: IEngineService,
  ) {}

  @Query(() => User, { name: 'user' })
  /**
   * It returns the user from the engine, if it exists. Same from the internal database
   * merge internal object over engine one to have a final user.
   * @param {Request} request - Request
   * @param {User} reqUser - The user that is currently logged in.
   * @returns A user object.
   */
  async getUser(@GQLRequest() request: Request, @CurrentUser() reqUser: User) {
    const user: Partial<User> = {};

    if (this.engineService.getActiveUser) {
      const engineUser = await this.engineService.getActiveUser(request);
      if (engineUser) Object.assign(user, engineUser);
    }

    // Checking if the user exists in the internal database. If it does, it will assign the user to the `user` object.
    try {
      const internalUser = await this.usersService.findOne(reqUser.id);

      if (internalUser && (!user.id || internalUser.id === user.id)) {
        Object.assign(user, internalUser);
      }
    } catch (e) {
      this.logger.verbose(e);
    }

    if (!user.id || !user.username)
      throw new InternalServerErrorException(
        'The user cannot be construct from the engine',
      );

    return user as User;
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
    @CurrentUser() user: User,
  ) {
    if (this.engineService.updateUser)
      return this.engineService.updateUser(request, user.id, updateUserInput);

    await this.usersService.update(user.id, updateUserInput);

    return await this.getUser(request, user);
  }
}
