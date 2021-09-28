import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import { Result } from '../result/result.model';

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

  @Field(() => [Result])
  result: Result[];
}
