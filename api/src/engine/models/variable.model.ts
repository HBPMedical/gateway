import { Field, ObjectType } from '@nestjs/graphql';
import { Category } from './category.model';
import { Entity } from './entity.model';
import { Group } from './group.model';

@ObjectType()
export class Variable extends Entity {
  @Field()
  type: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => [Category])
  enumerations: Category[];

  @Field(() => [Group])
  groups: Group[];
}
