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

  @Field(() => [Category], { nullable: true, defaultValue: [] })
  enumerations?: Category[];

  @Field(() => [Group], { nullable: true, defaultValue: [] })
  groups?: Group[];
}
