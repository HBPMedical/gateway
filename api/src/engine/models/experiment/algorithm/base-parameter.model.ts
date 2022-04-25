import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class BaseParameter {
  @Field()
  id: string;

  @Field()
  label: string;

  @Field({
    nullable: true,
    description: 'Small hint (description) for the end user',
  })
  hint?: string;

  @Field({ nullable: true, defaultValue: false })
  isRequired?: boolean;

  @Field({ nullable: true, defaultValue: false })
  isMultiple?: boolean;

  @Field({ nullable: true })
  defaultValue?: string;
}
