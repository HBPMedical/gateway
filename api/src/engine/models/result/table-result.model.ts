import { Field, ObjectType } from '@nestjs/graphql';
import { MetaData } from './common/metadata.model';

@ObjectType()
export class TableResult {
  @Field()
  name: string;

  @Field(() => [[String]])
  data: string[][];

  @Field(() => [MetaData])
  metadatas: MetaData[];
}
