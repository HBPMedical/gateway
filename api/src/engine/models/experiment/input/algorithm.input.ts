import { Field, InputType } from '@nestjs/graphql';
import { AlgorithmParamInput } from './algorithm-parameter.input';

@InputType()
export class AlgorithmInput {
  @Field()
  name: string;

  @Field(() => [AlgorithmParamInput])
  parameters: AlgorithmParamInput[];

  @Field()
  type: string;
}
