import { Field, InputType } from '@nestjs/graphql';
import { AlgorithmInput } from './algorithm.input';

@InputType()
export class ExperimentCreateInput {
  @Field(() => [String])
  datasets: string[];

  @Field(() => String, { nullable: true })
  filter: string;

  @Field()
  domain: string;

  @Field(() => [String])
  variables: string[];

  @Field()
  algorithm: AlgorithmInput;

  @Field()
  name: string;
}
