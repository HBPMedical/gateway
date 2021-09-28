import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export abstract class Result {
  @Field({ nullable: true })
  groupBy?: string;
}
