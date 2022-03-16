import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Response } from 'express';

/**
 * Access to graphQL request through the context
 * @returns request from graphql
 */
export const GQLResponse = createParamDecorator(
  (data: unknown, context: ExecutionContext): Response => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().res;
  },
);
