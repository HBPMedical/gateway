import { Field, ObjectType } from '@nestjs/graphql';
@ObjectType()
export class Configuration {
  @Field()
  connectorId: string;

  @Field({ nullable: true, defaultValue: false })
  galaxy?: boolean;

  @Field()
  version: string;
}
