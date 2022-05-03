import { Field, ObjectType, PartialType } from '@nestjs/graphql';
import { ResultUnion } from '../result/common/result-union.model';
import { Author } from './author.model';

@ObjectType()
export class Transformation {
  @Field({ description: "Variable's id on which to apply the transformation" })
  id: string;

  @Field({ description: 'Transformation to apply' })
  operation: string;
}

@ObjectType()
export class Formula {
  @Field(() => [Transformation], { nullable: true, defaultValue: [] })
  transformations: Transformation[];

  @Field(() => [[String]], { nullable: true, defaultValue: [] })
  interactions: string[][];
}

@ObjectType()
export class ParamValue {
  @Field()
  id: string;

  @Field()
  value: string;
}
@ObjectType()
export class AlgorithmResult {
  @Field()
  id: string;

  @Field(() => [ParamValue], { nullable: true, defaultValue: [] })
  parameters?: ParamValue[];
}

@ObjectType()
export class Experiment {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field(() => Author, { nullable: true, defaultValue: '' })
  author?: Author;

  @Field({ nullable: true })
  createdAt?: number;

  @Field({ nullable: true })
  updateAt?: number;

  @Field({ nullable: true })
  finishedAt?: number;

  @Field({ nullable: true, defaultValue: false })
  viewed?: boolean;

  @Field({ nullable: true })
  status?: string;

  @Field({ defaultValue: false })
  shared?: boolean;

  @Field(() => [ResultUnion], { nullable: true, defaultValue: [] })
  results?: Array<typeof ResultUnion>;

  @Field(() => [String])
  datasets: string[];

  @Field(() => String, { nullable: true })
  filter?: string;

  @Field()
  domain: string;

  @Field(() => [String])
  variables: string[];

  @Field(() => [String], { nullable: true, defaultValue: [] })
  coVariables?: string[];

  @Field(() => [String], { nullable: true, defaultValue: [] })
  filterVariables?: string[];

  @Field(() => Formula, { nullable: true })
  formula?: Formula;

  @Field()
  algorithm: AlgorithmResult;
}

@ObjectType()
export class PartialExperiment extends PartialType(Experiment) {}
