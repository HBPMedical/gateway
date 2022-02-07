import { HttpService } from '@nestjs/axios';
import {
  CallHandler,
  HttpException,
  Inject,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { IncomingMessage } from 'http';
import { catchError, Observable, tap } from 'rxjs';
import { ENGINE_MODULE_OPTIONS } from '../engine.constants';
import { IEngineOptions } from '../engine.interfaces';

@Injectable()
export class HeadersInterceptor implements NestInterceptor {
  private readonly logger: Logger;

  constructor(
    private httpService: HttpService,
    @Inject(ENGINE_MODULE_OPTIONS) private readonly options: IEngineOptions,
  ) {
    // Logger name is the engine name
    // HttpService will be used mostly by the engine (but it's not always true)
    this.logger = new Logger(options.type);
  }

  intercept(context: GqlExecutionContext, next: CallHandler): Observable<any> {
    // cleaner : add only the auth header (should find the name)

    const keys = ['cookie', 'x-xsrf-token']; // should be a module parameter
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

    Object.keys(headers) // copy needed keys
      .filter((key) => keys.includes(key))
      .map((key) => key.toLowerCase())
      .forEach((key) => {
        this.httpService.axiosRef.defaults.headers.common[key] = headers[key];
      });

    return next.handle().pipe(
      catchError((e) => {
        if (!e.response || !e.response.data || !e.response.status) throw e;

        this.logger.log(e.message);
        this.logger.verbose(
          `[Error ${e.response.status}] ${e.response.data.message}`,
        );
        throw new HttpException(e.response.data, e.response.status); // catch errors, maybe make it optional (module parameter)
      }),
      tap(() => {
        this.httpService.axiosRef.defaults.headers.common = {}; // cleaning request
      }),
    );
  }
}
