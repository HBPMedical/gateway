import { Field, InputType } from '@nestjs/graphql';
import { AlgorithmInput } from './algorithm.input';

@InputType()
export class FormulaTransformation {
  @Field()
  id: string;

  @Field()
  operation: string;
}

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

  @Field(() => [String], { nullable: true, defaultValue: [] })
  coVariables?: string[];

  @Field()
  algorithm: AlgorithmInput;

  @Field()
  name: string;

  @Field(() => [FormulaTransformation], { nullable: true })
  transformations: FormulaTransformation[];

  @Field(() => [[String]], { nullable: true })
  interactions: string[][];
}
