import { Field, ObjectType } from '@nestjs/graphql';
import { BaseParameter } from './algorithm/base-parameter.model';
import { NominalParameter } from './algorithm/nominal-parameter.model';
import { NumberParameter } from './algorithm/number-parameter.model';
import { VariableParameter } from './algorithm/variable-parameter.model';

type Parameter = BaseParameter | NumberParameter | NominalParameter;

@ObjectType()
export class Algorithm {
  @Field()
  id: string;

  @Field(() => [BaseParameter], { nullable: true, defaultValue: [] })
  parameters?: Parameter[];

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
