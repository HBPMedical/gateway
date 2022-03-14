import { Controller, Get, Inject, Post, UseInterceptors } from '@nestjs/common';
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

  @Get('/algorithms')
  getAlgorithms(): Observable<string> | string {
    return this.engineService.getAlgorithmsREST();
  }

  @Get('activeUser')
  getActiveUser(): Observable<string> | string {
    return this.engineService.getActiveUser();
  }

  @Post('activeUser/agreeNDA')
  agreeNDA(): Observable<string> | string {
    return this.engineService.editActiveUser();
  }

  @Get('logout')
  logout(): void {
    this.engineService.logout();
  }

  @Get('galaxy')
  galaxy(): Observable<string> | string {
    return this.engineService.getPassthrough?.('galaxy');
  }
}
