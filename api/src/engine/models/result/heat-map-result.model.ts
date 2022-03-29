import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { ChartAxis } from './common/chart-axis.model';
import { Result } from './common/result.model';

enum HeatMapStyle {
  NORMAL,
  BUBBLE,
}

registerEnumType(HeatMapStyle, {
  name: 'HeatMapStyle',
  description: 'Type of display.',
});

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

  @Field(() => HeatMapStyle, {
    defaultValue: HeatMapStyle.NORMAL,
    nullable: true,
  })
  heatMapStyle?: HeatMapStyle;
}
