import { Field, InputType } from '@nestjs/graphql';

/**
 * This class is used to add a common extra field to
 * an input class in order to provide specific
 * information for a connector
 */
@InputType()
export class Extrafield {
  @Field({ nullable: true })
  extradata: string;
}
