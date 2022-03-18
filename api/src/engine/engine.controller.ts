import {
  Controller,
  Get,
  Inject,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ENGINE_SERVICE } from './engine.constants';
import { IEngineService } from './engine.interfaces';
import { ErrorsInterceptor } from './interceptors/errors.interceptor';

@UseGuards(JwtAuthGuard)
@UseInterceptors(ErrorsInterceptor)
@Controller()
export class EngineController {
  constructor(
    @Inject(ENGINE_SERVICE) private readonly engineService: IEngineService,
  ) {}

  @Get('/algorithms')
  getAlgorithms(@Req() request: Request): Observable<string> | string {
    return this.engineService.getAlgorithmsREST(request);
  }

  @Get('activeUser')
  async getActiveUser(@Req() request: Request) {
    return await this.engineService.getActiveUser(request);
  }

  @Post('activeUser/agreeNDA')
  async agreeNDA(@Req() request: Request) {
    return await this.engineService.updateUser(request);
  }

  @Get('logout')
  logout(@Req() request: Request): void {
    this.engineService.logout(request);
  }

  @Get('galaxy')
  galaxy(@Req() request: Request): Observable<string> | string {
    return this.engineService.getPassthrough?.('galaxy', request);
  }
}
