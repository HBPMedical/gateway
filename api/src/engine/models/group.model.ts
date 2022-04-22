import { Field, ObjectType } from '@nestjs/graphql';
import { BaseModel } from './entity.model';

@ObjectType()
export class Group extends BaseModel {
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

  @Field(() => [String], {
    description: 'List of datasets avalaible, set null if all datasets allowed',
    nullable: true,
  })
  datasets?: string[];
}
