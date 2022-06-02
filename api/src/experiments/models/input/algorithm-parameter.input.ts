import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AlgorithmParamInput {
  @Field()
  id: string;

  @Field(() => String)
  value: string;
}
