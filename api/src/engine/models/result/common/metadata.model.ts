import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MetaData {
  @Field()
  name: string;

  @Field()
  type: string;
}
