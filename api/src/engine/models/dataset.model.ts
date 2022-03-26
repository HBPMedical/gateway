import { Field, ObjectType } from '@nestjs/graphql';
import { BaseModel } from './entity.model';

@ObjectType()
export class Dataset extends BaseModel {
  @Field({ nullable: true, defaultValue: false })
  isLongitudinal?: boolean;
}
