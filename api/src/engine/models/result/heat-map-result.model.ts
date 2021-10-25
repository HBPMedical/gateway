import { Field, ObjectType } from '@nestjs/graphql';
import { Result } from './common/result.model';

@ObjectType()
export class HeatMapResult extends Result {
  @Field()
  name: string;

  @Field(() => [[Number]])
  matrix: number[][];

  @Field(() => [String])
  xLabels: string[];

  @Field(() => [String])
  yLabels: string[];
}
