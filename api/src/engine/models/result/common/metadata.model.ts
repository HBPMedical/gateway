import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Metadata {
  @Field()
  name: string;

  @Field()
  type: string;
}
