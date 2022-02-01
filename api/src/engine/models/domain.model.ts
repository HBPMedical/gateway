import { Field, ObjectType } from '@nestjs/graphql';
import { Dataset } from './dataset.model';
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

  @Field(() => [Dataset])
  datasets: Dataset[];

  @Field(() => Group)
  rootGroup: Group;
}
