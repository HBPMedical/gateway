import { Field, ObjectType } from '@nestjs/graphql';
import { Theme } from './theme.model';

@ObjectType()
export class Configuration {
  @Field()
  connectorId: string;

  @Field(() => Theme, { nullable: true })
  theme?: Theme;
}
