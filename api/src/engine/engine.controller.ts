import {
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { ENGINE_SERVICE } from './engine.constants';
import { IEngineService } from './engine.interfaces';

@Controller()
export class EngineController {
  constructor(
    @Inject(ENGINE_SERVICE) private readonly engineService: IEngineService,
  ) {}

  @Get('/test')
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

  @Get('/experiments/:uuid')
  getExperiment(@Param('uuid') uuid: string): Observable<string> {
    return this.engineService.getExperiment(uuid);
  }

  @Delete('/experiments/:uuid')
  deleteExperiment(
    @Param('uuid') uuid: string,
    @Req() request: Request,
  ): Observable<string> {
    return this.engineService.deleteExperiment(uuid, request);
  }

  @Patch('/experiments/:uuid')
  editExperiment(
    @Param('uuid') uuid: string,
    @Req() request: Request,
  ): Observable<string> {
    return this.engineService.editExperiment(uuid, request);
  }

  @Post('experiments/transient')
  startExperimentTransient(@Req() request: Request): Observable<string> {
    return this.engineService.startExperimentTransient(request);
  }

  @Post('experiments')
  startExperiment(@Req() request: Request): Observable<string> {
    return this.engineService.startExperiment(request);
  }
}
