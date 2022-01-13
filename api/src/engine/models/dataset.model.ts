import { Field, ObjectType } from '@nestjs/graphql';
import { Entity } from './entity.model';

@ObjectType()
export class Dataset extends Entity {
  @Field({ nullable: true, defaultValue: false })
  isLongitudinal?: boolean;
}
