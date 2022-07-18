import { Inject, UseGuards, UseInterceptors } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { Request } from 'express';
import { Public } from 'src/auth/decorators/public.decorator';
import { GlobalAuthGuard } from 'src/auth/guards/global-auth.guard';
import { parseToBoolean } from 'src/common/utils/shared.utils';
import { Md5 } from 'ts-md5';
import { authConstants } from '../auth/auth-constants';
import { GQLRequest } from '../common/decorators/gql-request.decoractor';
import {
  ENGINE_MODULE_OPTIONS,
  ENGINE_ONTOLOGY_URL,
  ENGINE_SKIP_TOS,
} from './engine.constants';
import EngineService from './engine.service';
import { ErrorsInterceptor } from './interceptors/errors.interceptor';
import EngineOptions from './interfaces/engine-options.interface';
import { Configuration } from './models/configuration.model';
import { Domain } from './models/domain.model';
import { Algorithm } from './models/experiment/algorithm.model';
import { FilterConfiguration } from './models/filter/filter-configuration';
import { FormulaOperation } from './models/formula/formula-operation.model';

@UseInterceptors(ErrorsInterceptor)
@UseGuards(GlobalAuthGuard)
@Resolver()
export class EngineResolver {
  constructor(
    private readonly engineService: EngineService,
    @Inject(ENGINE_MODULE_OPTIONS)
    private readonly engineOptions: EngineOptions,
    private readonly configSerivce: ConfigService,
  ) {}

  @Query(() => Configuration)
  @Public()
  configuration(): Configuration {
    const config = this.engineService.getConfiguration();
    const matomo = this.configSerivce.get('matomo');

    const data = {
      ...(config ?? {}),
      connectorId: this.engineOptions.type,
      skipTos: parseToBoolean(this.configSerivce.get(ENGINE_SKIP_TOS)),
      enableSSO: parseToBoolean(
        this.configSerivce.get(authConstants.enableSSO),
      ),
      skipAuth: parseToBoolean(
        this.configSerivce.get(authConstants.skipAuth),
        true,
      ),
      matomo,
      ontologyUrl: this.configSerivce.get(ENGINE_ONTOLOGY_URL),
    };

    const version = Md5.hashStr(JSON.stringify(data));

    return {
      ...data,
      version,
    };
  }

  @Query(() => [Domain])
  async domains(@GQLRequest() req: Request) {
    return this.engineService.getDomains(req);
  }

  @Query(() => [Algorithm])
  async algorithms(@GQLRequest() req: Request) {
    return this.engineService.getAlgorithms(req);
  }

  @Query(() => [FormulaOperation])
  async formula() {
    if (this.engineService.has('getFormulaConfiguration'))
      return this.engineService.getFormulaConfiguration();

    return [];
  }

  @Query(() => FilterConfiguration)
  async filter() {
    if (this.engineService.has('getFilterConfiguration'))
      return this.engineService.getFilterConfiguration();

    return [];
  }
}
