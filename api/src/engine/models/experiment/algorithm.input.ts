import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AlgorithmInput {
  @Field(() => [String])
  datasets: string[];

  @Field(() => [String])
  variables: string[];

  @Field(() => String, { nullable: true })
  filter: string;

  @Field()
  domain: string;

  @Field()
  algorithm: string;

  @Field()
  name: string;
}
