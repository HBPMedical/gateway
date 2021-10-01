import { Field, ObjectType } from '@nestjs/graphql';
import { AlgorithmParameter } from './algorithm-parameter.model';

@ObjectType()
export class Algorithm {
  @Field()
  name: string;

  @Field(() => [AlgorithmParameter], { nullable: true, defaultValue: [] })
  parameters: AlgorithmParameter[];

  @Field()
  type: string;
}
