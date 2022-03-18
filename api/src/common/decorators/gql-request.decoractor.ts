import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';

/**
 * Access to graphQL request through the context
 * @returns request from graphql
 */
export const GQLRequest = createParamDecorator(
  (data: unknown, context: ExecutionContext): Request => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  },
);
