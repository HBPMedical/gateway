import { Module } from '@nestjs/common';
import { ExperimentsService } from './experiments.service';
import { ExperimentsResolver } from './experiments.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Experiment } from 'src/engine/models/experiment/experiment.model';

@Module({
  imports: [TypeOrmModule.forFeature([Experiment])],
  providers: [ExperimentsService, ExperimentsResolver],
})
export class ExperimentsModule {}
