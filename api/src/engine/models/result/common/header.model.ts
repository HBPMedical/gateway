import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Header {
  @Field()
  name: string;

  @Field()
  type: string;
}
