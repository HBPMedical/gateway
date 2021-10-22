import { Field, ObjectType } from '@nestjs/graphql';
import { Entity } from './entity.model';

@ObjectType()
export class Group extends Entity {
  @Field({ nullable: true })
  description?: string;

  @Field(() => [String], { defaultValue: [], nullable: true })
  groups?: string[];

  @Field(() => [String], {
    description: "List of variable's ids",
    defaultValue: [],
    nullable: true,
  })
  variables?: string[];
}
