import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
@ObjectType()
export class BaseModel {
  @Field()
  id: string;

  @Field({ nullable: true })
  label?: string;
}
