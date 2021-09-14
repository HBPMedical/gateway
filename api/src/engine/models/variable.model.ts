import { Field, ObjectType } from '@nestjs/graphql';
import { Category } from './category.model';
import { Group } from './group.model';

@ObjectType()
export class Variable {
  @Field()
  id: string;

  @Field({ nullable: true })
  label?: string;

  @Field()
  type: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => [Category])
  enumerations: Category[];

  @Field(() => [Group])
  groups: Group[];
}
