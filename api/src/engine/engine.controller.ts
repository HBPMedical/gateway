import { HttpService } from '@nestjs/axios';
import { Controller, Get, Inject } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ENGINE_SERVICE } from './engine.constants';
import { IEngineService } from './engine.interfaces';

@Controller()
export class EngineController {
  constructor(@Inject(ENGINE_SERVICE) private readonly engineService: IEngineService, private readonly httpService: HttpService) { }

  @Get("/test")
  getTest(): string {
    return this.engineService.demo();
  }

  @Get('/algorithms')
  getAlgorithms(): Observable<string> {
    return this.engineService.getAlgorithms();
  }
}
