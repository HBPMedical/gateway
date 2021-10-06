import { Field, ObjectType } from '@nestjs/graphql';
import { Header } from './common/header.model';
import { Result } from './common/result.model';

@ObjectType()
export class TableResult extends Result {
  @Field()
  name: string;

  @Field(() => [[String]])
  data: string[][];

  @Field(() => [Header])
  headers: Header[];
}
