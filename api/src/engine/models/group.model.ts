import { Field, ObjectType } from '@nestjs/graphql';
import { Variable } from './variable.model';

@ObjectType()
export class Group {
  @Field()
  id: string;

  @Field()
  label: string;

  @Field({ nullable: true })
  description?: string;

  @Field((type) => [Group])
  groups: Group[];

  @Field((type) => [Variable])
  variables: Variable[];
}
