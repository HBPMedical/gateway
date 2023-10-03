import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Header {
  @Field({ nullable: true })
  name?: string;

  @Field((type) => [String], { nullable: true })
  names?: string[];

  @Field()
  type: string;
}
