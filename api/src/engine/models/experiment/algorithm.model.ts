import { Field, ObjectType } from '@nestjs/graphql';
import { AlgorithmParameter } from './algorithm-parameter.model';

@ObjectType()
export class Algorithm {
  @Field()
  name: string;

  @Field(() => [AlgorithmParameter], { nullable: true, defaultValue: [] })
  parameters?: AlgorithmParameter[];

  @Field({ nullable: true })
  label?: string;

  @Field({ nullable: true })
  type?: string;

  @Field({ nullable: true })
  description?: string;
}
