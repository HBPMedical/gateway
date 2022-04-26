import { Controller, Get, Inject, Req, UseInterceptors } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { ENGINE_SERVICE } from './engine.constants';
import { IEngineService } from './engine.interfaces';
import { ErrorsInterceptor } from './interceptors/errors.interceptor';

@UseInterceptors(ErrorsInterceptor)
@Controller()
export class EngineController {
  constructor(
    @Inject(ENGINE_SERVICE) private readonly engineService: IEngineService,
  ) {}

  @Get('galaxy')
  galaxy(@Req() request: Request): Observable<string> | string {
    return this.engineService.getPassthrough?.('galaxy', request);
  }
}
