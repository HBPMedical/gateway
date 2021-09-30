import {
  createUnionType,
  Field,
  GraphQLISODateTime,
  ObjectType,
} from '@nestjs/graphql';
import { DummyResult } from '../result/dummy-result.model';
import { TableResult } from '../result/table-result.model';

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
  @Field()
  title: string;

  @Field({ nullable: true })
  uuid?: string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  created_at?: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  update_at?: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  finished_at?: Date;

  @Field(() => [ResultUnion])
  results: Array<typeof ResultUnion>;
}
