import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class FormulaOperation {
  @Field({ description: 'Type name of the variable' })
  variableType: string;

  @Field(() => [String], {
    description: 'List of operation available for this type',
  })
  operationTypes: string[];
}
