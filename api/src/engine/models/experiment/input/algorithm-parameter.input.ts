import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AlgorithmParamInput {
  @Field()
  name: string;

  @Field(() => [String])
  value: string[];
}
