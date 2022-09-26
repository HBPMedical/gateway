import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Header } from './common/header.model';
import { Result } from './common/result.model';

export enum TableStyle {
  DEFAULT,
  NORMAL,
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

  @Field(() => TableStyle, { defaultValue: TableStyle.DEFAULT, nullable: true })
  tableStyle?: TableStyle;
}
