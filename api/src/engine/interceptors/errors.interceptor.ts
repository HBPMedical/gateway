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
import EngineOptions from '../interfaces/engine-options.interface';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  private readonly logger: Logger;

  constructor(
    @Inject(ENGINE_MODULE_OPTIONS) private readonly options: EngineOptions,
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
          `[Error ${e.response.status}] ${
            e.response.data.message ?? e.response.data
          }`,
        );
        throw new HttpException(e.response.data, e.response.status); // catch errors, maybe make it optional (module parameter)
      }),
    );
  }
}
