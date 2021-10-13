import { Field, ObjectType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { Result } from './common/result.model';

// field name 'rawdata' was used instead of 'data' because of typing problem on union with same field name
// see :https://stackoverflow.com/questions/44170603/graphql-using-same-field-names-in-different-types-within-union

@ObjectType()
export class RawResult extends Result {
  @Field(() => GraphQLJSON)
  rawdata: unknown;
}
