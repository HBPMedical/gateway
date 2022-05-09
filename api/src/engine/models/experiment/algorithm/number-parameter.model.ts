import { Field, ObjectType } from '@nestjs/graphql';
import { BaseParameter } from './base-parameter.model';
@ObjectType({ implements: () => [BaseParameter] })
export class NumberParameter implements BaseParameter {
  name: string;
  label?: string;
  hint?: string;
  isRequired?: boolean;
  hasMultiple?: boolean;
  defaultValue?: string;

  @Field({ nullable: true })
  min?: number;

  @Field({ nullable: true })
  max?: number;

  @Field({ nullable: true, defaultValue: false })
  isReal?: boolean;
}
