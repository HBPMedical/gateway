import { ObjectType } from '@nestjs/graphql';
import { Entity } from './entity.model';

@ObjectType()
export class Category extends Entity {}
