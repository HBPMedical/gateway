import { Field, ObjectType } from '@nestjs/graphql';
import { BaseParameter } from './algorithm/base-parameter.model';
import { Parameter } from './algorithm.model';

@ObjectType()
export class AlgorithmPreprocessing {
  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  label?: string;

  @Field({
    nullable: true,
    description: 'Small hint (description) for the end user',
  })
  hint?: string;

  @Field(() => [BaseParameter], { nullable: true, defaultValue: [] })
  parameters?: Parameter[];
}
