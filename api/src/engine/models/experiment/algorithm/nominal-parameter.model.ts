import { Field, registerEnumType } from '@nestjs/graphql';
import { BaseParameter } from './base-parameter.model';

enum AllowedLink {
  VARIABLE,
  COVARIATE,
}

registerEnumType(AllowedLink, {
  name: 'AllowedLink',
  description: 'The supported links.',
});

export class LinkedParameter extends BaseParameter {
  @Field({ description: 'Id of the parameter' })
  linkedTo: string;

  @Field(() => [String], { defaultValue: [], nullable: true })
  allowedValues?: string[];
}
