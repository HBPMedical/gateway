import { ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { parseToBoolean } from '../../common/interfaces/utilities.interface';
import { authConstants } from '../auth-constants';

@Injectable()
export class JwtAuthGuard extends AuthGuard(['jwt-cookies', 'jwt-bearer']) {
  constructor(private readonly configService: ConfigService) {
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
    const skipAuth = parseToBoolean(
      this.configService.get(authConstants.skipAuth, 'false'),
    );

    if (skipAuth) {
      return true;
    }

    return super.canActivate(context);
  }
}
