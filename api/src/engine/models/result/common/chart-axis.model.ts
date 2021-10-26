import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class ChartAxis {
  @Field({ nullable: true, defaultValue: '' })
  label?: string;

  @Field(() => [String], { nullable: true, defaultValue: [] })
  categories?: string[];
}
