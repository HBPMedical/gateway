import { Field, ObjectType } from '@nestjs/graphql';
import { Dataset } from './dataset.model';
import { BaseModel } from './entity.model';
import { Group } from './group.model';
import { Variable } from './variable.model';

@ObjectType()
export class Domain extends BaseModel {
  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  version?: string;

  @Field(() => [Group])
  groups: Group[];

  @Field(() => [Variable])
  variables: Variable[];

  @Field(() => [Dataset])
  datasets: Dataset[];

  @Field(() => Group)
  rootGroup: Group;

  @Field({ nullable: true, defaultValue: false })
  longitudinal?: boolean;
}
