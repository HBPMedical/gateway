import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class TransientCreateInput {
  @Field()
  name: string;
}
