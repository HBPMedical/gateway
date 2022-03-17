import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AuthenticationInput {
  @Field()
  username: string;

  @Field()
  password: string;
}
