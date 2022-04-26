import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { BaseParameter } from './base-parameter.model';

enum AllowedLink {
  VARIABLE,
  COVARIABLE,
}

registerEnumType(AllowedLink, {
  name: 'AllowedLink',
  description: 'The supported links.',
});

@ObjectType({ implements: () => [BaseParameter] })
export class NominalParameter implements BaseParameter {
  id: string;
  label?: string;
  hint?: string;
  isRequired?: boolean;
  hasMultiple?: boolean;
  defaultValue?: string;

  @Field({ nullable: true, description: 'Id of the parameter' })
  linkedTo?: string;

  @Field(() => [String], { defaultValue: [], nullable: true })
  allowedValues?: string[];
}
