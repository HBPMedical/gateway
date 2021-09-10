import { HttpService } from '@nestjs/axios';
import { Controller, Get, Inject } from '@nestjs/common';
import { ENGINE_SERVICE } from './engine.constants';
import { IEngineService } from './engine.interface';

@Controller()
export class EngineController {
  constructor(@Inject(ENGINE_SERVICE) private readonly engineService: IEngineService, private readonly httpService: HttpService) { }

  @Get("/test")
  getTest(): string {
    return this.engineService.demo();
  }
}
