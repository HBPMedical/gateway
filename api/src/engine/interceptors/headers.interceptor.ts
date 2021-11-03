import { HttpService } from '@nestjs/axios';
import { Injectable, NestInterceptor, CallHandler } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { IncomingMessage } from 'http';
import { Observable, tap } from 'rxjs';

@Injectable()
export class HeadersInterceptor implements NestInterceptor {
  constructor(private httpService: HttpService) {}

  intercept(context: GqlExecutionContext, next: CallHandler): Observable<any> {
    // cleaner : add only the auth header (should find the name)

    const keys = ['cookie', 'x-xsrf-token'];
    let headers = {};

    switch (context.getType()) {
      case 'http': {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest<Request>();
        headers = request.headers;
        break;
      }
      case 'graphql': {
        const ctx = GqlExecutionContext.create(context);
        const req: IncomingMessage = ctx.getContext().req;
        headers = req.headers;
        break;
      }
    }

    Object.keys(headers)
      .filter((key) => keys.includes(key))
      .map((key) => key.toLowerCase())
      .forEach((key) => {
        this.httpService.axiosRef.defaults.headers.common[key] = headers[key];
      });

    return next.handle().pipe(
      tap(() => {
        this.httpService.axiosRef.defaults.headers.common = {}; //cleaning request
      }),
    );
  }
}
