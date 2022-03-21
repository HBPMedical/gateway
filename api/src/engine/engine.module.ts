import { HttpModule, HttpService } from '@nestjs/axios';
import { DynamicModule, Global, Logger, Module } from '@nestjs/common';
import { ENGINE_MODULE_OPTIONS, ENGINE_SERVICE } from './engine.constants';
import { EngineController } from './engine.controller';
import { IEngineOptions, IEngineService } from './engine.interfaces';
import { EngineResolver } from './engine.resolver';

@Global()
@Module({})
export class EngineModule {
  private static readonly logger = new Logger(EngineModule.name);

  static forRoot(options?: Partial<IEngineOptions>): DynamicModule {
    const optionsProvider = {
      provide: ENGINE_MODULE_OPTIONS,
      useValue: {
        type: process.env.ENGINE_TYPE,
        baseurl: process.env.ENGINE_BASE_URL,
        ...(options ?? {}),
      },
    };

    const engineProvider = {
      provide: ENGINE_SERVICE,
      useFactory: async (httpService: HttpService) => {
        return await this.createEngineConnection(
          optionsProvider.useValue,
          httpService,
        );
      },
      inject: [HttpService],
    };

    return {
      module: EngineModule,
      imports: [HttpModule],
      providers: [optionsProvider, engineProvider, EngineResolver],
      controllers: [EngineController],
      exports: [optionsProvider, engineProvider],
    };
  }

  private static async createEngineConnection(
    opt: IEngineOptions,
    httpService: HttpService,
  ): Promise<IEngineService> {
    try {
      const service = await import(`./connectors/${opt.type}/main.connector`);
      const engine = new service.default(opt, httpService);

      return engine;
    } catch (e) {
      this.logger.error(`There is a problem with the connector '${opt.type}'`);
      this.logger.verbose(e);
    }
  }
}
