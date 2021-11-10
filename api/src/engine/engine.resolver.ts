import { Inject, UseInterceptors } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ENGINE_SERVICE } from './engine.constants';
import { IEngineService } from './engine.interfaces';
import { HeadersInterceptor } from './interceptors/headers.interceptor';
import { Domain } from './models/domain.model';
import { Algorithm } from './models/experiment/algorithm.model';
import {
  Experiment,
  PartialExperiment,
} from './models/experiment/experiment.model';
import { ExperimentCreateInput } from './models/experiment/input/experiment-create.input';
import { ExperimentEditInput } from './models/experiment/input/experiment-edit.input';
import { ListExperiments } from './models/experiment/list-experiments.model';

@UseInterceptors(HeadersInterceptor)
@Resolver()
export class EngineResolver {
  constructor(
    @Inject(ENGINE_SERVICE) private readonly engineService: IEngineService,
  ) {}

  @Query(() => [Domain])
  async domains(
    @Args('ids', { nullable: true, type: () => [String], defaultValue: [] })
    ids: string[],
  ) {
    return this.engineService.getDomains(ids);
  }

  @Query(() => ListExperiments)
  async experiments(
    @Args('page', { nullable: true, defaultValue: 0 }) page: number,
    @Args('name', { nullable: true, defaultValue: '' }) name: string,
  ) {
    return this.engineService.listExperiments(page, name);
  }

  @Query(() => Experiment)
  async experiment(@Args('id') id: string) {
    return this.engineService.getExperiment(id);
  }

  @Query(() => [Algorithm])
  async algorithms() {
    return this.engineService.getAlgorithms();
  }

  @Mutation(() => Experiment)
  async createExperiment(
    @Args('data') experimentCreateInput: ExperimentCreateInput,
    @Args('isTransient', { nullable: true, defaultValue: false })
    isTransient: boolean,
  ) {
    return this.engineService.createExperiment(
      experimentCreateInput,
      isTransient,
    );
  }

  @Mutation(() => Experiment)
  async editExperiment(
    @Args('id') id: string,
    @Args('data') experiment: ExperimentEditInput,
  ) {
    return this.engineService.editExperient(id, experiment);
  }

  @Mutation(() => PartialExperiment)
  async removeExperiment(@Args('id') id: string): Promise<PartialExperiment> {
    return this.engineService.removeExperiment(id);
  }
}
