import { Field, ObjectType } from '@nestjs/graphql';
import { Matomo } from './configuration/matomo.model';
@ObjectType()
export class Configuration {
  @Field()
  connectorId: string;

  @Field({ nullable: true, defaultValue: false })
  hasGalaxy?: boolean;

  @Field({
    nullable: true,
    defaultValue: false,
    description: 'Indicates if histograms can handle grouping',
  })
  hasGrouping?: boolean;

  @Field({ nullable: true })
  contactLink?: string;

  @Field()
  version: string;

  @Field({ nullable: true })
  skipAuth?: boolean;

  @Field({ nullable: true, defaultValue: false })
  skipTos?: boolean;

  @Field({ nullable: true, defaultValue: true })
  enableSSO?: boolean;

  @Field(() => Matomo, { nullable: true })
  matomo?: Matomo;

  @Field({ nullable: true })
  ontologyUrl?: string;
}
