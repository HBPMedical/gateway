import { Field, ObjectType } from '@nestjs/graphql';
import { MetaData } from './common/metadata.model';
import { Result } from './common/result.model';

@ObjectType()
export class TableResult extends Result {
  @Field()
  name: string;

  @Field(() => [[String]])
  data: string[][];

  @Field(() => [MetaData])
  metadatas: MetaData[];
}
