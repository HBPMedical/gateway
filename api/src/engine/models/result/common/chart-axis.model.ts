import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class ChartAxis {
  @Field({ nullable: true, defaultValue: '', description: 'label of the Axis' })
  label?: string;

  @Field(() => [String], {
    nullable: true,
    defaultValue: [],
    description: 'label of each element on this Axis',
  })
  categories?: string[];
}
