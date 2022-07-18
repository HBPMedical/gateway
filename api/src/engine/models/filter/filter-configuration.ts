import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class FilterConfiguration {
  @Field(() => [String], {
    description: 'List of types that can considered as number',
    defaultValue: ['real', 'integer'],
    nullable: true,
  })
  numberTypes?: string[];
}
