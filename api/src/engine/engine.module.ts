import { HttpModule } from '@nestjs/axios';
import { DynamicModule, Logger, Module } from '@nestjs/common';
import { ENGINE_MODULE_OPTIONS } from './engine.constants';
import { EngineController } from './engine.controller';
import { EngineResolver } from './engine.resolver';
import EngineService from './engine.service';
import EngineOptions from './interfaces/engine-options.interface';

@Module({})
export class EngineModule {
  static forRoot(options?: Partial<EngineOptions>): DynamicModule {
    const optionsProvider = {
      provide: ENGINE_MODULE_OPTIONS,
      useValue: {
        ...options,
        type: options?.type.toLowerCase(),
      },
    };

    return {
      global: true,
      module: EngineModule,
      imports: [HttpModule],
      providers: [optionsProvider, EngineService, EngineResolver],
      controllers: [EngineController],
      exports: [optionsProvider, EngineService],
    };
  }
}
