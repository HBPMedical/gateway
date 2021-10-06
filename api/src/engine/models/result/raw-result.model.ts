import { Field, ObjectType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { Result } from './common/result.model';

@ObjectType()
export class RawResult extends Result {
  @Field(() => GraphQLJSONObject)
  data: unknown;

  @Field(() => [String], { defaultValue: [] })
  listMax?: string[];
}
