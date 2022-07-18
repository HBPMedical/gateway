import { Field, InterfaceType } from '@nestjs/graphql';
import { NominalParameter } from './nominal-parameter.model';
import { NumberParameter } from './number-parameter.model';
import { StringParameter } from './string-parameter.model';

@InterfaceType({
  resolveType(param) {
    if (
      param.min ||
      param.max ||
      param.isReal ||
      param.__typename === 'NumberParameter'
    )
      return NumberParameter;

    if (
      param.allowedValues ||
      param.linkedTo ||
      param.__typename === 'NominalParameter'
    )
      return NominalParameter;

    return StringParameter;
  },
})
export abstract class BaseParameter {
  @Field()
  name: string;

  @Field({ nullable: true })
  label?: string;

  @Field({
    nullable: true,
    description: 'Small hint (description) for the end user',
  })
  hint?: string;

  @Field({ nullable: true, defaultValue: false })
  isRequired?: boolean;

  @Field({ nullable: true, defaultValue: false })
  hasMultiple?: boolean;

  @Field({ nullable: true })
  defaultValue?: string;
}
