import { Field, InputType } from '@nestjs/graphql';
import { AlgorithmParamInput } from './algorithm-parameter.input';
import { AlgorithmPreprocessingInput } from './algorithm-preprocessing.input';
@InputType()
export class AlgorithmInput {
  @Field()
  id: string;

  @Field(() => [AlgorithmParamInput], { nullable: true, defaultValue: [] })
  parameters: AlgorithmParamInput[];

  @Field(() => [AlgorithmPreprocessingInput], {
    nullable: true,
    defaultValue: [],
  })
  preprocessing: AlgorithmPreprocessingInput[];

  @Field({ nullable: true })
  type?: string;
}
