import { HttpService } from '@nestjs/axios';
import { Controller, Get, Inject, Req } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { ENGINE_SERVICE } from './engine.constants';
import { IEngineService } from './engine.interfaces';

@Controller()
export class EngineController {
  constructor(@Inject(ENGINE_SERVICE) private readonly engineService: IEngineService) { }

  @Get("/test")
  getTest(): string {
    return this.engineService.demo();
  }

  @Get('/algorithms')
  getAlgorithms(@Req() request: Request): Observable<string> {
    return this.engineService.getAlgorithms(request);
  }

  @Get('/experiments')
  getExperiments(@Req() request: Request): Observable<string> {
    return this.engineService.getExperiments(request);
  }

}
