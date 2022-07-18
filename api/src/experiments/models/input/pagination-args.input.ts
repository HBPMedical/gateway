import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class PaginationArgsInput {
  @Field()
  limit?: number;

  @Field()
  offset?: number;
}
