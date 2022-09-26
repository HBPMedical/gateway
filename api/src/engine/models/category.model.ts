import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Category {
  @Field()
  value: string;

  @Field({ nullable: true })
  label?: string;
}
