import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { BaseParameter } from './base-parameter.model';

enum AllowedLink {
  VARIABLE = 'VARIABLE',
  COVARIABLE = 'COVARIABLE',
}

registerEnumType(AllowedLink, {
  name: 'AllowedLink',
  description: 'The supported links.',
});

@ObjectType()
export class OptionValue {
  @Field()
  id: string;

  @Field()
  label: string;
}

@ObjectType({ implements: () => [BaseParameter] })
export class NominalParameter implements BaseParameter {
  id: string;
  label?: string;
  hint?: string;
  isRequired?: boolean;
  hasMultiple?: boolean;
  defaultValue?: string;

  @Field(() => AllowedLink, {
    nullable: true,
    description: 'Id of the parameter',
  })
  linkedTo?: AllowedLink;

  @Field(() => [OptionValue], { defaultValue: [], nullable: true })
  allowedValues?: OptionValue[];
}
