import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Matomo {
  @Field({ nullable: true, defaultValue: false })
  enabled?: boolean;

  @Field({ nullable: true })
  siteId?: string;

  @Field({ nullable: true })
  urlBase?: string;
}
