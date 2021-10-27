import { Field, ObjectType } from '@nestjs/graphql';
import { ChartAxis } from './common/chart-axis.model';
import { Result } from './common/result.model';

@ObjectType()
export class HeatMapResult extends Result {
  @Field()
  name: string;

  @Field(() => ChartAxis, { nullable: true })
  xAxis?: ChartAxis;

  @Field(() => ChartAxis, { nullable: true })
  yAxis?: ChartAxis;

  @Field(() => [[Number]])
  matrix: number[][];
}
