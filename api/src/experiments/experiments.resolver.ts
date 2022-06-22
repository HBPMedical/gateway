import { Logger, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Request } from 'express';
import EngineService from '../engine/engine.service';
import { GlobalAuthGuard } from '../auth/guards/global-auth.guard';
import { GQLRequest } from '../common/decorators/gql-request.decoractor';
import { CurrentUser } from '../common/decorators/user.decorator';
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
    private readonly engineService: EngineService,
    private readonly experimentService: ExperimentsService,
  ) {}

  @Query(() => ListExperiments)
  async experimentList(
    @Args('page', { nullable: true, defaultValue: 0 }) page: number,
    @Args('name', { nullable: true, defaultValue: '' }) name: string,
    @GQLRequest() req: Request,
  ): Promise<ListExperiments> {
    if (this.engineService.has('listExperiments')) {
      return this.engineService.listExperiments(page, name, req);
    }

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
    if (this.engineService.has('getExperiment'))
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
    if (this.engineService.has('createExperiment')) {
      return this.engineService.createExperiment(data, isTransient, req);
    }

    //if the experiment is transient we wait a response before returning a response
    if (isTransient) {
      const results = await this.engineService.runExperiment(data, req);
      const expTransient = this.experimentService.dataToExperiment(data, user);
      return { ...expTransient, results, status: ExperimentStatus.SUCCESS };
    }

    //if not we will create an experiment in local db
    const experiment = await this.experimentService.create(
      data,
      user,
      ExperimentStatus.PENDING,
    );

    //create an async query that will update the result when it's done
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

    //we return the experiment before finishing the runExperiment
    return experiment;
  }

  @Mutation(() => Experiment)
  async editExperiment(
    @GQLRequest() req: Request,
    @Args('id') id: string,
    @Args('data') experiment: ExperimentEditInput,
    @CurrentUser() user: User,
  ) {
    if (this.engineService.has('editExperiment'))
      return this.engineService.editExperiment(id, experiment, req);

    return this.experimentService.update(id, experiment, user);
  }

  @Mutation(() => PartialExperiment)
  async removeExperiment(
    @Args('id') id: string,
    @GQLRequest() req: Request,
    @CurrentUser() user: User,
  ): Promise<PartialExperiment> {
    if (this.engineService.has('removeExperiment'))
      return this.engineService.removeExperiment(id, req);

    return this.experimentService.remove(id, user);
  }
}
