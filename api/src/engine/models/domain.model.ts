import { Field, ObjectType } from '@nestjs/graphql';
import { Category } from './category.model';
import { Entity } from './entity.model';
import { Group } from './group.model';
import { Variable } from './variable.model';

@ObjectType()
export class Domain extends Entity {
  @Field({ nullable: true })
  description?: string;

  @Field(() => [Group])
  groups: Group[];

  @Field(() => [Variable])
  variables: Variable[];

  @Field(() => [Category])
  datasets: Category[];

  @Field(() => Group)
  rootGroup: Group;
}
