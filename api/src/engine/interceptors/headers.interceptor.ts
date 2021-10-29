import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class HeadersInterceptor implements NestInterceptor {
  constructor(private httpService: HttpService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();

    //console.log(context.switchToHttp().getRequest());

    console.log('interceptor headers', request);

    //this.httpService.axiosRef.defaults.headers = request.headers;

    return next.handle();
  }
}
