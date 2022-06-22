import { Controller, Get, Req, UseInterceptors } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import EngineService from './engine.service';
import { ErrorsInterceptor } from './interceptors/errors.interceptor';

@UseInterceptors(ErrorsInterceptor)
@Controller()
export class EngineController {
  constructor(private readonly engineService: EngineService) {}

  @Get('galaxy')
  galaxy(@Req() request: Request): Observable<string> | string {
    if (this.engineService.has('getPassthrough'))
      return this.engineService.getPassthrough('galaxy', request);
  }
}
