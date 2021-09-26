import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Entity {
  @Field()
  id: string;

  @Field({ nullable: true })
  label: string;
}
