import { Field, ObjectType } from '@nestjs/graphql';
import { Category } from './category.model';
import { Group } from './group.model';

@ObjectType()
export class Domain extends Group {
  @Field(() => [Category])
  datasets: Category[];
}
