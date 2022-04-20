import { Field, ObjectType } from '@nestjs/graphql';
import { ChartAxis } from './common/chart-axis.model';
import { Result } from './common/result.model';

@ObjectType()
export class PointCI {
  @Field({ nullable: true })
  min?: number;

  @Field()
  mean: number;

  @Field({ nullable: true })
  max?: number;
}

@ObjectType()
export class MeanChartResult extends Result {
  @Field()
  name: string;

  @Field(() => ChartAxis, { nullable: true })
  xAxis?: ChartAxis;

  @Field(() => ChartAxis, { nullable: true })
  yAxis?: ChartAxis;

  @Field(() => [PointCI], {
    description: 'List of points with confidence information: min, mean, max',
    defaultValue: [],
  })
  pointCIs: PointCI[];
}
