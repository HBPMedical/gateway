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
import { catchError, Observable } from 'rxjs';
import { ENGINE_MODULE_OPTIONS } from '../engine.constants';
import { IEngineOptions } from '../engine.interfaces';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
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
    return next.handle().pipe(
      catchError((e) => {
        if (!e.response || !e.response.data || !e.response.status) throw e;

        this.logger.log(e.message);
        this.logger.verbose(
          `[Error ${e.response.status}] ${e.response.data.message}`,
        );
        throw new HttpException(e.response.data, e.response.status); // catch errors, maybe make it optional (module parameter)
      }),
    );
  }
}