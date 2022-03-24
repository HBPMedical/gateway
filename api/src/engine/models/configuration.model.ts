import { Field, ObjectType } from '@nestjs/graphql';
@ObjectType()
export class Configuration {
  @Field()
  connectorId: string;

  @Field({ nullable: true, defaultValue: false })
  hasGalaxy?: boolean;

  @Field({ nullable: true })
  contactLink?: string;

  @Field()
  version: string;

  @Field({ nullable: true })
  skipAuth?: boolean;

  @Field({ nullable: true })
  skipTos?: boolean;

  @Field({ nullable: true, defaultValue: true })
  enableSSO?: boolean;
}
