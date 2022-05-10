import { Field, ObjectType } from '@nestjs/graphql';
import { BaseParameter } from './algorithm/base-parameter.model';
import { VariableParameter } from './algorithm/variable-parameter.model';

@ObjectType()
export class Algorithm {
  @Field()
  id: string;

  @Field(() => [BaseParameter], { nullable: true, defaultValue: [] })
  parameters?: BaseParameter[];

  @Field(() => VariableParameter)
  variable?: VariableParameter;

  @Field(() => VariableParameter, { nullable: true })
  coVariable?: VariableParameter;

  @Field({ nullable: true, defaultValue: false })
  hasFormula?: boolean;

  @Field({ nullable: true })
  type?: string;

  @Field({ nullable: true })
  label?: string;

  @Field({ nullable: true })
  description?: string;
}
