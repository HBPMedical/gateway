import { Inject, UseGuards, UseInterceptors } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { Query, Resolver } from '@nestjs/graphql';
import { Request } from 'express';
import { GlobalAuthGuard } from '../auth/guards/global-auth.guard';
import { parseToBoolean } from '../common/utils/shared.utils';
import authConfig from '../config/auth.config';
import { Md5 } from 'ts-md5';
import { GQLRequest } from '../common/decorators/gql-request.decoractor';
import { ENGINE_MODULE_OPTIONS, ENGINE_SKIP_TOS } from './engine.constants';
import EngineService from './engine.service';
import { ErrorsInterceptor } from './interceptors/errors.interceptor';
import EngineOptions from './interfaces/engine-options.interface';
import { Configuration } from './models/configuration.model';
import { Domain } from './models/domain.model';
import { Algorithm } from './models/experiment/algorithm.model';
import { FilterConfiguration } from './models/filter/filter-configuration';
import { FormulaOperation } from './models/formula/formula-operation.model';
import { Public } from '../auth/decorators/public.decorator';

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
    const engineConf = this.engineService.getConfiguration();
    const authConf: ConfigType<typeof authConfig> =
      this.configSerivce.get('auth');

    const data = {
      ...(engineConf ?? {}),
      connectorId: this.engineOptions.type,
      skipTos: parseToBoolean(this.configSerivce.get(ENGINE_SKIP_TOS)),
      enableSSO: parseToBoolean(authConf.enableSSO),
      skipAuth: parseToBoolean(authConf.skipAuth, true),
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
