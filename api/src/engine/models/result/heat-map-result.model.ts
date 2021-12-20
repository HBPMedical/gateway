import { Field, ObjectType } from '@nestjs/graphql';
import { ChartAxis } from './common/chart-axis.model';
import { Result } from './common/result.model';

@ObjectType()
export class HeatMapResult extends Result {
  @Field()
  name: string;

  @Field(() => [[Number]])
  matrix: number[][];

  @Field(() => ChartAxis)
  xAxis: ChartAxis;

  @Field(() => ChartAxis)
  yAxis: ChartAxis;
}
