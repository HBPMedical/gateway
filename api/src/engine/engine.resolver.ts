import { Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ENGINE_SERVICE } from './engine.constants';
import { IEngineService } from './engine.interfaces';
import { Domain } from './models/domain.model';
import { TransientCreateInput } from './models/transient/transient-create.input';
import { Transient } from './models/transient/transient.model';

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

  @Mutation(() => Transient)
  async createTransient(
    @Args('data') transientCreateInput: TransientCreateInput,
  ) {
    return this.engineService.createTransient(transientCreateInput);
  }
}
