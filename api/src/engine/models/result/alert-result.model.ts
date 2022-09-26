import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Result } from './common/result.model';

export enum AlertLevel {
  INFO,
  SUCCESS,
  WARNING,
  ERROR,
}

registerEnumType(AlertLevel, {
  name: 'AlertLevel',
});

@ObjectType()
export class AlertResult extends Result {
  @Field({ nullable: true })
  title?: string;

  @Field()
  message: string;

  @Field(() => AlertLevel, { defaultValue: AlertLevel.INFO, nullable: true })
  level?: AlertLevel;
}
