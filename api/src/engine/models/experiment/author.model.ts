import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Author {
  @Field({ nullable: true, defaultValue: '' })
  username?: string;

  @Field({ nullable: true, defaultValue: '' })
  fullname?: string;
}
