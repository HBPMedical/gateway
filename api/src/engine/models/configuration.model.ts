import { Field, ObjectType } from '@nestjs/graphql';
@ObjectType()
export class Configuration {
  @Field()
  connectorId: string;

  @Field({
    nullable: true,
    defaultValue: false,
    deprecationReason: 'Only used for legacy reason should be avoided',
  })
  hasGalaxy?: boolean;

  @Field({
    nullable: true,
    defaultValue: false,
    description: 'Indicates if histograms can handle grouping',
  })
  hasGrouping?: boolean;

  @Field({
    nullable: true,
    defaultValue: true,
    description: 'Indicates if filters and formula are enabled',
  })
  hasFilters?: boolean;

  @Field()
  version: string;

  @Field({ nullable: true })
  skipAuth?: boolean;

  @Field({ nullable: true, defaultValue: false })
  skipTos?: boolean;

  @Field({ nullable: true, defaultValue: true })
  enableSSO?: boolean;
}
