import { Inject } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { ENGINE_SERVICE } from './engine.constants';
import { IEngineService } from './engine.interfaces';
import { Domain } from './models/domain.model';

@Resolver()
export class EngineResolver {
  constructor(
    @Inject(ENGINE_SERVICE) private readonly engineService: IEngineService,
  ) {}

  @Query(() => Domain)
  async hello() {
    const dummy: Domain = {
      id: 'test',
      label: 'test',
      description: 'test',
      groups: [],
      variables: [],
      datasets: [],
    };

    return dummy;
  }
}
