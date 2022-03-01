import { HttpModule, HttpService } from '@nestjs/axios';
import { DynamicModule, Global, Logger, Module } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { Request } from 'express';
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
      useFactory: async (httpService: HttpService, req: Request) => {
        return await this.createEngineConnection(options, httpService, req);
      },
      inject: [HttpService, REQUEST],
    };

    return {
      module: EngineModule,
      imports: [
        HttpModule,
        GraphQLModule.forRoot({
          autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
          context: ({ req, res }) => ({ req, res }),
          cors: {
            credentials: true,
            origin: [
              /http:\/\/localhost($|:\d*)/,
              /http:\/\/127.0.0.1($|:\d*)/,
            ],
          },
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
    req: Request,
  ): Promise<IEngineService> {
    try {
      const service = await import(
        `./connectors/${options.type}/main.connector`
      );
      const engine = new service.default(options, httpService, req);

      return engine;
    } catch (e) {
      this.logger.error(
        `There is a problem with the connector '${options.type}'`,
      );
      this.logger.verbose(e);
      process.exit(); // We can't continue without an engine, shutdown the process...
    }
  }
}
