import { ObjectType } from '@nestjs/graphql';
import { BaseParameter } from './base-parameter.model';

@ObjectType({ implements: () => [BaseParameter] })
export class StringParameter implements BaseParameter {
  id: string;
  label?: string;
  hint?: string;
  isRequired?: boolean;
  hasMultiple?: boolean;
  defaultValue?: string;
}
