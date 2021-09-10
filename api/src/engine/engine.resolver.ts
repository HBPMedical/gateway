import { Inject } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { ENGINE_SERVICE } from './engine.constants';
import { IEngineService } from './engine.interface';

@Resolver()
export class EngineResolver {
    constructor(@Inject(ENGINE_SERVICE) private readonly engineService: IEngineService) { }

    @Query(() => String)
    async hello() {
        return this.engineService.demo();
    }
}