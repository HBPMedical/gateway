import { Inject, Logger, UseGuards } from '@nestjs/common';
import { Args, Resolver, Query, Mutation } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GQLRequest } from 'src/common/decorators/gql-request.decoractor';
import { ENGINE_SERVICE } from 'src/engine/engine.constants';
import { IEngineService } from 'src/engine/engine.interfaces';
import {
  Experiment,
  PartialExperiment,
} from 'src/engine/models/experiment/experiment.model';
import { ListExperiments } from 'src/engine/models/experiment/list-experiments.model';
import { Request } from 'express';
import { ExperimentCreateInput } from 'src/experiments/models/input/experiment-create.input';
import { ExperimentEditInput } from 'src/experiments/models/input/experiment-edit.input';
import { ExperimentsService } from './experiments.service';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/users/models/user.model';

const LIMIT_EXP_BY_PAGE = 10; // TODO Consider refactoring to allow offset and limit in API call

@UseGuards(JwtAuthGuard)
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
  ) {
    if (this.engineService.listExperiments)
      return this.engineService.listExperiments(page, name, req);

    return this.experimentService.findAll(
      {
        limit: LIMIT_EXP_BY_PAGE,
        offset: LIMIT_EXP_BY_PAGE * page,
      },
      name,
    );
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
    @Args('data') experimentCreateInput: ExperimentCreateInput,
    @Args('isTransient', { nullable: true, defaultValue: false })
    isTransient: boolean,
  ) {
    if (this.engineService.getExperiment) {
      return this.engineService.createExperiment(
        experimentCreateInput,
        isTransient,
        req,
      );
    }

    const experiment = await this.experimentService.create(
      experimentCreateInput,
      user,
    );

    //todo : run experiment method ? --> for those who doesnt provide full exp details

    this.engineService
      .createExperiment(experimentCreateInput, isTransient, req)
      .then((exp) => {
        this.experimentService.update(
          experiment.id,
          {
            results: exp.results,
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
