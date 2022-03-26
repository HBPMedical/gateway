import { ObjectType } from '@nestjs/graphql';
import { BaseModel } from './entity.model';

@ObjectType()
export class Category extends BaseModel {}
