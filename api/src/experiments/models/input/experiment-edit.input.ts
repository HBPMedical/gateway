import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ExperimentEditInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  shared?: boolean;

  @Field({ nullable: true })
  viewed?: boolean;
}
