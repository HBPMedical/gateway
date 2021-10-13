import { Field, ObjectType } from '@nestjs/graphql';
import { Entity } from './entity.model';

@ObjectType()
export class Group extends Entity {
  @Field({ nullable: true })
  description?: string;

  @Field(() => [Group])
  groups: Group[];

  @Field(() => [String], { description: "List of variable's ids" })
  variables: string[];
}
