import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AlgorithmParameter {
  @Field()
  name: string;

  @Field(() => [String])
  value: string[];
}
