import { Field, ObjectType } from '@nestjs/graphql';
import { Experiment } from './experiment.model';

@ObjectType()
export class ListExperiments {
  @Field({ nullable: true, defaultValue: 0 })
  currentPage?: number;

  @Field({ nullable: true })
  totalPages?: number;

  @Field({ nullable: true })
  totalExperiments?: number;

  @Field(() => [Experiment], { nullable: true, defaultValue: [] })
  experiments: Experiment[];
}
