import { HttpModule } from '@nestjs/axios';
import { CacheModule, DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
      imports: [
        HttpModule,
        CacheModule.registerAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => {
            const config = configService.get('cache');
            return {
              isGlobal: true,
              ttl: config.ttl,
              max: config.max,
            };
          },
          inject: [ConfigService],
        }),
      ],
      providers: [optionsProvider, EngineService, EngineResolver],
      controllers: [EngineController],
      exports: [optionsProvider, EngineService],
    };
  }
}
