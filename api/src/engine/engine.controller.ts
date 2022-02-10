import {
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ENGINE_SERVICE } from './engine.constants';
import { IEngineService } from './engine.interfaces';

@Controller()
export class EngineController {
  constructor(
    @Inject(ENGINE_SERVICE) private readonly engineService: IEngineService,
  ) {}

  @Get('/algorithms')
  getAlgorithms(): Observable<string> | string {
    return this.engineService.getAlgorithmsREST();
  }

  @Get('/experiments')
  getExperiments(): Observable<string> | string {
    return this.engineService.getExperiments();
  }

  @Get('/experiments/:uuid')
  getExperiment(@Param('uuid') uuid: string): Observable<string> | string {
    return this.engineService.getExperimentREST(uuid);
  }

  @Delete('/experiments/:uuid')
  deleteExperiment(@Param('uuid') uuid: string): Observable<string> | string {
    return this.engineService.deleteExperiment(uuid);
  }

  @Patch('/experiments/:uuid')
  editExperiment(@Param('uuid') uuid: string): Observable<string> | string {
    return this.engineService.editExperimentREST(uuid);
  }

  @Post('experiments/transient')
  startExperimentTransient(): Observable<string> | string {
    return this.engineService.startExperimentTransient();
  }

  @Post('experiments')
  startExperiment(): Observable<string> | string {
    return this.engineService.startExperiment();
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
