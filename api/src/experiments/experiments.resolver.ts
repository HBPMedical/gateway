import { Inject, Logger, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Request } from 'express';
import { GlobalAuthGuard } from '../auth/guards/global-auth.guard';
import { GQLRequest } from '../common/decorators/gql-request.decoractor';
import { CurrentUser } from '../common/decorators/user.decorator';
import { ENGINE_SERVICE } from '../engine/engine.constants';
import { IEngineService } from '../engine/engine.interfaces';
import {
  Experiment,
  ExperimentStatus,
  PartialExperiment,
} from '../engine/models/experiment/experiment.model';
import { ListExperiments } from '../engine/models/experiment/list-experiments.model';
import { User } from '../users/models/user.model';
import { ExperimentsService } from './experiments.service';
import { ExperimentCreateInput } from './models/input/experiment-create.input';
import { ExperimentEditInput } from './models/input/experiment-edit.input';

const LIMIT_EXP_BY_PAGE = 10; // TODO Consider refactoring to allow offset and limit in API call

@UseGuards(GlobalAuthGuard)
@Resolver()
export class ExperimentsResolver {
  private readonly logger = new Logger(ExperimentsResolver.name);

  constructor(
    @Inject(ENGINE_SERVICE) private readonly engineService: IEngineService,
    private readonly experimentService: ExperimentsService,
  ) {}

  @Query(() => ListExperiments)
  async experimentList(
    @Args('page', { nullable: true, defaultValue: 0 }) page: number,
    @Args('name', { nullable: true, defaultValue: '' }) name: string,
    @GQLRequest() req: Request,
  ): Promise<ListExperiments> {
    if (this.engineService.listExperiments)
      return this.engineService.listExperiments(page, name, req);

    const [results, total] = await this.experimentService.findAll(
      {
        limit: LIMIT_EXP_BY_PAGE,
        offset: LIMIT_EXP_BY_PAGE * page,
      },
      name,
    );
    return {
      experiments: results,
      currentPage: page,
      totalExperiments: total,
      totalPages: Math.ceil(total / LIMIT_EXP_BY_PAGE),
    };
  }

  @Query(() => Experiment)
  async experiment(
    @Args('id') id: string,
    @GQLRequest() req: Request,
    @CurrentUser() user: User,
  ) {
    if (this.engineService.getExperiment)
      return this.engineService.getExperiment(id, req);

    return this.experimentService.findOne(id, user);
  }

  @Mutation(() => Experiment)
  async createExperiment(
    @GQLRequest() req: Request,
    @CurrentUser() user: User,
    @Args('data') data: ExperimentCreateInput,
    @Args('isTransient', { nullable: true, defaultValue: false })
    isTransient: boolean,
  ) {
    if (this.engineService.createExperiment) {
      return this.engineService.createExperiment(data, isTransient, req);
    }

    if (isTransient) {
      const results = await this.engineService.runExperiment(data, req);
      const expTransient = this.experimentService.dataToExperiment(data, user);
      return { ...expTransient, results, status: ExperimentStatus.SUCCESS };
    }

    const experiment = await this.experimentService.create(
      data,
      user,
      ExperimentStatus.PENDING,
    );

    this.engineService.runExperiment(data, req).then((results) => {
      this.experimentService.update(
        experiment.id,
        {
          results,
          finishedAt: new Date().toISOString(),
          status: ExperimentStatus.SUCCESS,
        },
        user,
      );
    });

    return experiment;
  }

  @Mutation(() => Experiment)
  async editExperiment(
    @GQLRequest() req: Request,
    @Args('id') id: string,
    @Args('data') experiment: ExperimentEditInput,
    @CurrentUser() user: User,
  ) {
    if (this.engineService.editExperient)
      return this.engineService.editExperient(id, experiment, req);

    return this.experimentService.update(id, experiment, user);
  }

  @Mutation(() => PartialExperiment)
  async removeExperiment(
    @Args('id') id: string,
    @GQLRequest() req: Request,
    @CurrentUser() user: User,
  ): Promise<PartialExperiment> {
    if (this.engineService.removeExperiment)
      return this.engineService.removeExperiment(id, req);

    return this.experimentService.remove(id, user);
  }
}