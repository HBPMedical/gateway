import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Response } from 'express';

/**
 * Access to graphQL response through the context
 * @returns response from graphql
 */
export const GQLResponse = createParamDecorator(
  (data: unknown, context: ExecutionContext): Response => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().res;
  },
);
