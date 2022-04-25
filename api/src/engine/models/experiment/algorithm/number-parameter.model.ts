import { Field } from '@nestjs/graphql';
import { BaseParameter } from './base-parameter.model';

export class NumberParameter extends BaseParameter {
  @Field({ nullable: true })
  min?: number;

  @Field({ nullable: true })
  max?: number;
}
