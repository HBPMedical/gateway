import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User } from '../../users/models/user.model';

/**
 * Retrieve the current user within the graphQL request
 * @returns instance of User or undefined
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): User | undefined => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req.user;
  },
);
