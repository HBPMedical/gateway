import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class VariableParameter {
  @Field({ nullable: true })
  hint?: string;

  @Field({ nullable: true, defaultValue: false })
  isRequired: boolean;

  @Field({ nullable: true, defaultValue: false })
  hasMultiple: boolean;

  @Field(() => [String], { nullable: true })
  allowedTypes: string[];
}
