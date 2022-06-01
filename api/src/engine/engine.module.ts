import { HttpModule, HttpService } from '@nestjs/axios';
import {
  DynamicModule,
  Global,
  InternalServerErrorException,
  Logger,
  Module,
} from '@nestjs/common';
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
        return this.createEngineConnection(
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
    const service = await import(`./connectors/${opt.type}/main.connector`);
    const instance: IEngineService = new service.default(opt, httpService);

    if (instance.createExperiment && instance.runExperiment)
      throw new InternalServerErrorException(
        `Connector ${opt.type} should declare either createExperiment or runExperiment not both`,
      );

    if (
      instance.createExperiment &&
      (!instance.getExperiment ||
        !instance.listExperiments ||
        !instance.removeExperiment ||
        !instance.editExperiment)
    )
      throw new InternalServerErrorException(
        `Connector ${opt.type} has 'createExperiment' implemented it implies that getExperiment, listExperiments, removeExperiment and editExperiment methods must also be implemented.`,
      );
    return instance;
  }
}
