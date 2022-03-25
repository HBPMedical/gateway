import { Inject, UseGuards, UseInterceptors } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GQLRequest } from '../common/decorators/gql-request.decoractor';
import { Md5 } from 'ts-md5';
import {
  ENGINE_MODULE_OPTIONS,
  ENGINE_SERVICE,
  ENGINE_SKIP_TOS,
} from './engine.constants';
import { IEngineOptions, IEngineService } from './engine.interfaces';
import { Configuration } from './models/configuration.model';
import { Domain } from './models/domain.model';
import { Algorithm } from './models/experiment/algorithm.model';
import {
  Experiment,
  PartialExperiment,
} from './models/experiment/experiment.model';
import { ExperimentCreateInput } from './models/experiment/input/experiment-create.input';
import { ExperimentEditInput } from './models/experiment/input/experiment-edit.input';
import { ListExperiments } from './models/experiment/list-experiments.model';
import { ConfigService } from '@nestjs/config';
import { parseToBoolean } from '../common/utilities';
import { authConstants } from '../auth/auth-constants';
import { Public } from 'src/auth/decorators/public.decorator';
import { ErrorsInterceptor } from './interceptors/errors.interceptor';

@UseInterceptors(ErrorsInterceptor)
@UseGuards(JwtAuthGuard)
@Resolver()
export class EngineResolver {
  constructor(
    @Inject(ENGINE_SERVICE) private readonly engineService: IEngineService,
    @Inject(ENGINE_MODULE_OPTIONS)
    private readonly engineOptions: IEngineOptions,
    private readonly configSerivce: ConfigService,
  ) {}

  @Query(() => Configuration)
  @Public()
  configuration(): Configuration {
    const config = this.engineService.getConfiguration?.();

    const data = {
      ...(config ?? {}),
      skipAuth: parseToBoolean(
        this.configSerivce.get(authConstants.skipAuth),
        true,
      ),
      skipTos: parseToBoolean(this.configSerivce.get(ENGINE_SKIP_TOS)),
      enableSSO: parseToBoolean(
        this.configSerivce.get(authConstants.enableSSO),
      ),
      connectorId: this.engineOptions.type,
    };

    const version = Md5.hashStr(JSON.stringify(data));

    return {
      ...data,
      version,
    };
  }

  @Query(() => [Domain])
  async domains(
    @GQLRequest() req: Request,
    @Args('ids', { nullable: true, type: () => [String], defaultValue: [] })
    ids: string[],
  ) {
    return this.engineService.getDomains(ids, req);
  }

  @Query(() => ListExperiments)
  async experimentList(
    @Args('page', { nullable: true, defaultValue: 0 }) page: number,
    @Args('name', { nullable: true, defaultValue: '' }) name: string,
    @GQLRequest() req: Request,
  ) {
    return this.engineService.listExperiments(page, name, req);
  }

  @Query(() => Experiment)
  async experiment(@Args('id') id: string, @GQLRequest() req: Request) {
    return this.engineService.getExperiment(id, req);
  }

  @Query(() => [Algorithm])
  async algorithms(@GQLRequest() req: Request) {
    return this.engineService.getAlgorithms(req);
  }

  @Mutation(() => Experiment)
  async createExperiment(
    @GQLRequest() req: Request,
    @Args('data') experimentCreateInput: ExperimentCreateInput,
    @Args('isTransient', { nullable: true, defaultValue: false })
    isTransient: boolean,
  ) {
    return this.engineService.createExperiment(
      experimentCreateInput,
      isTransient,
      req,
    );
  }

  @Mutation(() => Experiment)
  async editExperiment(
    @GQLRequest() req: Request,
    @Args('id') id: string,
    @Args('data') experiment: ExperimentEditInput,
  ) {
    return this.engineService.editExperient(id, experiment, req);
  }

  @Mutation(() => PartialExperiment)
  async removeExperiment(
    @Args('id') id: string,
    @GQLRequest() req: Request,
  ): Promise<PartialExperiment> {
    return this.engineService.removeExperiment(id, req);
  }
}
