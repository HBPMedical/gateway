import { Field, ObjectType } from '@nestjs/graphql';
import { Entity } from './entity.model';
import { Variable } from './variable.model';

@ObjectType()
export class Group extends Entity {
  @Field({ nullable: true })
  description?: string;

  @Field(() => [Group])
  groups: Group[];

  @Field(() => [Variable])
  variables: Variable[];
}
