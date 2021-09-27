import { Field, ObjectType } from '@nestjs/graphql';
import { TableResult } from '../result/table-result.model';

@ObjectType()
export class Transient {
  @Field()
  title: string;

  @Field(() => [TableResult])
  result: TableResult[];
}
