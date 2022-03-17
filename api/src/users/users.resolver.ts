import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../auth/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateUserInput } from './inputs/update-user.input';
import { User } from './models/user.model';

@UseGuards(JwtAuthGuard)
@Resolver()
export class UsersResolver {
  /* 
    Query
      - GetCurrentUser (needed if page reloaded) 
  */
  /* 
    Mutation
      - Call for
  */
  @Mutation(() => User)
  updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUser() user: User,
  ) {
    // if engine service has function let him handle the change
    // other wise manage it locally

    return user;
  }
}
