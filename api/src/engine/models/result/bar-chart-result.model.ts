import { Field, ObjectType } from '@nestjs/graphql';
import { ChartAxis } from './common/chart-axis.model';
import { Result } from './common/result.model';

@ObjectType()
export class BarChartResult extends Result {
  @Field()
  name: string;

  @Field(() => ChartAxis, { nullable: true })
  xAxis?: ChartAxis;

  @Field(() => ChartAxis, { nullable: true })
  yAxis?: ChartAxis;

  @Field(() => [Number], { description: "List of bar's value" })
  barValues: number[];

  @Field({ defaultValue: false, nullable: true })
  hasConnectedBars?: boolean;
}
