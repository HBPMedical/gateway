import { Field, ObjectType } from '@nestjs/graphql';
import { Result } from './common/result.model';

@ObjectType()
export class DummyResult extends Result {
  @Field()
  name: string;

  @Field(() => [[String]])
  data: string[][];

  @Field(() => [String])
  listMax: string[];
}
