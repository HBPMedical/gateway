import { HttpModule, HttpService } from '@nestjs/axios';
import { DynamicModule, Global, Logger, Module } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { IncomingMessage } from 'http';
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
      useFactory: async (httpService: HttpService, req: Request) => {
        return await this.createEngineConnection(
          optionsProvider.useValue,
          httpService,
          req,
        );
      },
      inject: [HttpService, REQUEST],
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
    req: Request,
  ): Promise<IEngineService> {
    try {
      const service = await import(`./connectors/${opt.type}/main.connector`);
      const gqlRequest = req && req['req']; // graphql headers exception
      const request =
        gqlRequest && gqlRequest instanceof IncomingMessage ? gqlRequest : req;
      const engine = new service.default(opt, httpService, request);

      return engine;
    } catch (e) {
      this.logger.error(`There is a problem with the connector '${opt.type}'`);
      this.logger.verbose(e);
    }
  }
}
