import { Field, InputType } from '@nestjs/graphql';
import { AlgorithmParamInput } from './algorithm-parameter.input';

@InputType()
export class AlgorithmInput {
  @Field()
  name: string;

  @Field(() => [AlgorithmParamInput], { nullable: true, defaultValue: [] })
  parameters: AlgorithmParamInput[];

  @Field()
  type: string;
}
