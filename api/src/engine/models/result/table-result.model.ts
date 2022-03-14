import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Header } from './common/header.model';
import { Result } from './common/result.model';

export enum ThemeType {
  DEFAULT,
  NORMAL,
}

registerEnumType(ThemeType, {
  name: 'ThemeType',
});

@ObjectType()
export class TableResult extends Result {
  @Field()
  name: string;

  @Field(() => [[String]])
  data: string[][];

  @Field(() => [Header])
  headers: Header[];

  @Field(() => ThemeType, { defaultValue: ThemeType.DEFAULT })
  theme?: ThemeType;
}
