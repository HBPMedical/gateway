import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
@ObjectType()
export class User {
  @PrimaryColumn()
  @Field()
  id: string;

  @Field()
  username: string;

  @Field({ nullable: true })
  fullname?: string;

  @Field({ nullable: true })
  email?: string;

  @Column()
  @Field({ nullable: true })
  agreeNDA?: boolean;

  extraFields?: Record<string, any>;
}
