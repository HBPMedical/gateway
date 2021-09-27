import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
@ObjectType()
export class Entity {
  @Field()
  id: string;

  @Field({ nullable: true })
  label?: string;
}
