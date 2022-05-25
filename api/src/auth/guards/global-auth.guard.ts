import { ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { parseToBoolean } from '../../common/utilities';
import { authConstants } from '../auth-constants';

@Injectable()
export class GlobalAuthGuard extends AuthGuard([
  'engine',
  'jwt-cookies',
  'jwt-bearer',
]) {
  constructor(
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
  ) {
    super();
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const gqlReq = ctx.getContext().req;

    return gqlReq ?? ctx.switchToHttp().getRequest();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );

    const skipAuth = parseToBoolean(
      this.configService.get(authConstants.skipAuth, 'false'),
    );

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }
}
