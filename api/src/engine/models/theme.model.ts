import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Theme {
  @Field({ nullable: true })
  logo?: string;

  @Field({ nullable: true })
  favicon?: string;

  @Field({ nullable: true })
  cssFile?: string;
}
