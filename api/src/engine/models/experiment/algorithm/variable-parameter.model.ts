import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class VariableParameter {
  @Field({ nullable: true })
  hint?: string;

  @Field({ nullable: true, defaultValue: false })
  isRequired?: boolean;

  @Field({ nullable: true, defaultValue: false })
  hasMultiple?: boolean;

  @Field(() => [String], {
    nullable: true,
    description: 'If undefined, all types are allowed',
  })
  allowedTypes?: string[];
}
