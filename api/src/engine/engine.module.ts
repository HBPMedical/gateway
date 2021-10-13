import { HttpModule, HttpService } from '@nestjs/axios';
import { DynamicModule, Global, Logger, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ENGINE_MODULE_OPTIONS, ENGINE_SERVICE } from './engine.constants';
import { EngineController } from './engine.controller';
import { IEngineOptions, IEngineService } from './engine.interfaces';
import { EngineResolver } from './engine.resolver';

@Global()
@Module({})
export class EngineModule {
  private static readonly logger = new Logger(EngineModule.name);

  static async forRootAsync(options: IEngineOptions): Promise<DynamicModule> {
    const optionsProvider = {
      provide: ENGINE_MODULE_OPTIONS,
      useValue: options,
    };

    const engineProvider = {
      provide: ENGINE_SERVICE,
      useFactory: async (httpService: HttpService) => {
        return await this.createEngineConnection(options, httpService);
      },
      inject: [HttpService],
    };

    return {
      module: EngineModule,
      imports: [
        HttpModule,
        GraphQLModule.forRoot({
          autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        }),
      ],
      providers: [optionsProvider, engineProvider, EngineResolver],
      controllers: [EngineController],
      exports: [optionsProvider, engineProvider],
    };
  }

  private static async createEngineConnection(
    options: IEngineOptions,
    httpService: HttpService,
  ): Promise<IEngineService> {
    try {
      const service = await import(
        `./connectors/${options.type}/main.connector`
      );
      const engine = new service.default(options, httpService);

      this.logger.log(`The connector '${options.type}' has been loaded`);

      return engine;
    } catch {
      this.logger.error(
        `There is a problem with the connector '${options.type}'`,
      );
      process.exit(); // We can't continue without an engine, shutdown the process...
    }
  }
}
