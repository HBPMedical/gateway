import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { IncomingMessage } from 'http';
import { Observable } from 'rxjs';

@Injectable()
export class HeadersInterceptor implements NestInterceptor {
  constructor(private httpService: HttpService) {}

  intercept(context: GqlExecutionContext, next: CallHandler): Observable<any> {
    // cleaner : add only the auth header (should find the name)

    switch (context.getType()) {
      case 'http': {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest<Request>();
        this.httpService.axiosRef.defaults.headers = request.headers;
        break;
      }
      case 'graphql': {
        const ctx = GqlExecutionContext.create(context);
        const req: IncomingMessage = ctx.getContext().req;
        this.httpService.axiosRef.defaults.headers = req.headers;
        break;
      }
    }

    return next.handle();
  }
}
