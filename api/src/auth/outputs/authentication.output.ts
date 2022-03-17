import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../../users/models/user.model';

@ObjectType()
export class AuthenticationOutput {
  @Field(() => User)
  user: User;

  @Field()
  accessToken: string;
}
