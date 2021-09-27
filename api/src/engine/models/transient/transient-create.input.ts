import { Field, InputType } from '@nestjs/graphql';
import { Extrafield } from '../utility/extrafield.input';

@InputType()
export class TransientCreateInput extends Extrafield {
  @Field(() => [String])
  datasets: string[];

  @Field(() => [String])
  variables: string[];

  @Field(() => String, { nullable: true })
  filter: string;

  @Field()
  domain: string;
}
