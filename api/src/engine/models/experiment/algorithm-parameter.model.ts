import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AlgorithmParameter {
  @Field()
  id: string;

  @Field({ nullable: true })
  value?: string;

  @Field({ nullable: true })
  label?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  defaultValue?: string;

  @Field({ defaultValue: false, nullable: true })
  isMultiple?: boolean;

  @Field({ defaultValue: false, nullable: true })
  isRequired?: boolean;

  @Field({ nullable: true })
  min?: string;

  @Field({ nullable: true })
  max?: string;

  @Field({ nullable: true })
  type?: string;
}
