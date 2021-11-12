import { Field, ObjectType, PartialType } from '@nestjs/graphql';
import { ResultUnion } from '../result/common/result-union.model';
import { Algorithm } from './algorithm.model';
import { Author } from './author.model';

@ObjectType()
export class Experiment {
  @Field({ nullable: true })
  id?: string;

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

  @Field()
  algorithm: Algorithm;

  @Field()
  name: string;
}

@ObjectType()
export class PartialExperiment extends PartialType(Experiment) {}
