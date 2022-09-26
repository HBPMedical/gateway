import { Field, InputType } from '@nestjs/graphql';
import { AlgorithmParamInput } from './algorithm-parameter.input';

@InputType()
export class AlgorithmInput {
  @Field()
  id: string;

  @Field(() => [AlgorithmParamInput], { nullable: true, defaultValue: [] })
  parameters: AlgorithmParamInput[];

  @Field({ nullable: true })
  type?: string;
}
