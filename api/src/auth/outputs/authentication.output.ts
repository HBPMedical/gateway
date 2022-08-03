import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AuthenticationOutput {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}
