import {
  createUnionType,
  Field,
  GraphQLISODateTime,
  ObjectType,
} from '@nestjs/graphql';
import { DummyResult } from '../result/dummy-result.model';
import { TableResult } from '../result/table-result.model';
import { Algorithm } from './algorithm.model';

export const ResultUnion = createUnionType({
  name: 'ResultUnion',
  types: () => [TableResult, DummyResult],
  resolveType(value) {
    if (value.headers) {
      return TableResult;
    }
    if (value.listMax) {
      return DummyResult;
    }

    return null;
  },
});

@ObjectType()
export class Experiment {
  @Field({ nullable: true })
  uuid?: string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  created_at?: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  update_at?: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  finished_at?: Date;

  @Field({ defaultValue: false })
  viewed?: boolean;

  @Field({ nullable: true })
  status?: string;

  @Field({ defaultValue: false })
  shared?: boolean;

  @Field(() => [ResultUnion])
  results: Array<typeof ResultUnion>;

  @Field(() => [String])
  datasets: string[];

  @Field(() => String, { nullable: true })
  filter: string;

  @Field()
  domain: string;

  @Field(() => [String])
  variables: string[];

  @Field()
  algorithm: Algorithm;

  @Field()
  name: string;
}
