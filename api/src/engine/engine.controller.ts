import {
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
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

  @Get('/experiments')
  getExperiments(): Observable<string> | string {
    return this.engineService.getExperiments();
  }

  @Get('/experiments/:id')
  getExperiment(@Param('id') id: string): Observable<string> | string {
    return this.engineService.getExperimentREST(id);
  }

  @Delete('/experiments/:id')
  deleteExperiment(@Param('id') id: string): Observable<string> | string {
    return this.engineService.deleteExperiment(id);
  }

  @Patch('/experiments/:id')
  editExperiment(@Param('id') id: string): Observable<string> | string {
    return this.engineService.editExperimentREST(id);
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
