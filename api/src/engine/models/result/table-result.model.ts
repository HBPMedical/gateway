import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Header } from './common/header.model';
import { Result } from './common/result.model';

export enum TableStyle {
  DEFAULT,
  STATISTICAL,
  HIERARCHICAL,
}

registerEnumType(TableStyle, {
  name: 'TableStyle',
});

@ObjectType()
export class TableResult extends Result {
  @Field()
  name: string;

  @Field(() => [[String]])
  data: string[][];

  @Field(() => [Header])
  headers: Header[];

  @Field(() => [Header], { nullable: true })
  childHeaders?: Header[];

  @Field(() => TableStyle, { defaultValue: TableStyle.DEFAULT, nullable: true })
  tableStyle?: TableStyle;
}
