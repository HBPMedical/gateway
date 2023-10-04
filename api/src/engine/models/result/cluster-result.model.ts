import { Field, ObjectType } from '@nestjs/graphql';
import { Result } from './common/result.model';
import GraphQLJSON from 'graphql-type-json';

@ObjectType()
export class ClusterResult extends Result {
  @Field()
  name: string;

  @Field(() => GraphQLJSON, { nullable: true, defaultValue: [] })
  nmatrix: unknown;
}
