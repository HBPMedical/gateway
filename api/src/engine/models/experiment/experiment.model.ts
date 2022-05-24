import {
  Field,
  ObjectType,
  PartialType,
  registerEnumType,
} from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ResultUnion } from '../result/common/result-union.model';
import { Author } from './author.model';

export enum ExperimentStatus {
  INIT = 'init',
  PENDING = 'pending',
  SUCCESS = 'success',
  WARN = 'warn',
  ERROR = 'error',
}

registerEnumType(ExperimentStatus, {
  name: 'ExperimentStatus',
});

@ObjectType()
export class Transformation {
  @Field({ description: "Variable's id on which to apply the transformation" })
  id: string;

  @Field({ description: 'Transformation to apply' })
  operation: string;
}

@ObjectType()
export class Formula {
  @Field(() => [Transformation], { nullable: true, defaultValue: [] })
  transformations: Transformation[];

  @Field(() => [[String]], { nullable: true, defaultValue: [] })
  interactions: string[][];
}

@ObjectType()
export class ParamValue {
  @Field()
  name: string;

  @Field()
  value: string;
}
@ObjectType()
export class AlgorithmResult {
  @Field()
  name: string;

  @Field(() => [ParamValue], { nullable: true, defaultValue: [] })
  parameters?: ParamValue[];
}

@Entity()
@ObjectType()
export class Experiment {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @Column()
  @Field()
  name: string;

  @Column('jsonb', { nullable: true })
  @Field(() => Author, { nullable: true, defaultValue: '' })
  author?: Author;

  @Column({ nullable: true })
  @Field({ nullable: true })
  createdAt?: number;

  @Column({ nullable: true })
  @Field({ nullable: true })
  updateAt?: number;

  @Column({ nullable: true })
  @Field({ nullable: true })
  finishedAt?: number;

  @Column({ nullable: true, default: false })
  @Field({ nullable: true, defaultValue: false })
  viewed?: boolean;

  @Column({
    type: 'enum',
    enum: ExperimentStatus,
    default: ExperimentStatus.INIT,
  })
  @Field(() => ExperimentStatus, { nullable: true })
  status?: ExperimentStatus;

  @Column({ nullable: true, default: false })
  @Field({ defaultValue: false })
  shared?: boolean;

  @Column('jsonb', { nullable: true })
  @Field(() => [ResultUnion], { nullable: true, defaultValue: [] })
  results?: Array<typeof ResultUnion>;

  @Column('text', { array: true })
  @Field(() => [String])
  datasets: string[];

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  filter?: string;

  @Column()
  @Field()
  domain: string;

  @Column('text', { array: true })
  @Field(() => [String])
  variables: string[];

  @Column('text', { nullable: true, array: true })
  @Field(() => [String], { nullable: true, defaultValue: [] })
  coVariables?: string[];

  @Column('text', { nullable: true, array: true })
  @Field(() => [String], { nullable: true, defaultValue: [] })
  filterVariables?: string[];

  @Column('jsonb', { nullable: true })
  @Field(() => Formula, { nullable: true })
  formula?: Formula;

  @Column('jsonb', { nullable: true })
  @Field()
  algorithm: AlgorithmResult;
}

@ObjectType()
export class PartialExperiment extends PartialType(Experiment) {}
