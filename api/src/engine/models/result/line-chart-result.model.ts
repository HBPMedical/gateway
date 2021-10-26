import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { ChartAxis } from './common/chart-axis.model';
import { Result } from './common/result.model';

export enum LineType {
  NORMAL,
  DASHED,
}

registerEnumType(LineType, {
  name: 'LineType',
});

@ObjectType()
export class ExtraLineInfo {
  @Field()
  label: string;

  @Field(() => [String])
  values: string[];
}

@ObjectType()
export class LineResult {
  @Field()
  label: string;

  @Field(() => Number)
  x: number[];

  @Field(() => [Number])
  y: number[];

  @Field(() => [ExtraLineInfo], { nullable: true, defaultValue: [] })
  extraLineInfos?: ExtraLineInfo[];

  @Field(() => LineType, { nullable: true, defaultValue: LineType.NORMAL })
  type?: LineType;
}

@ObjectType()
export class LineChartResult extends Result {
  @Field()
  name: string;

  @Field(() => ChartAxis)
  xAxis?: ChartAxis;

  @Field(() => ChartAxis)
  yAxis?: ChartAxis;

  @Field(() => [LineResult])
  lines: LineResult[];
}
