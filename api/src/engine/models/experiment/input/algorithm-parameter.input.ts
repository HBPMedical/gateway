import { Field, InputType, registerEnumType } from '@nestjs/graphql';

export enum ParamType {
  STRING,
  NUMBER,
}

registerEnumType(ParamType, {
  name: 'ParamType',
});

@InputType()
export class AlgorithmParamInput {
  @Field()
  id: string;

  @Field(() => ParamType, {
    nullable: true,
    defaultValue: ParamType.STRING,
  })
  type?: ParamType;

  @Field(() => String)
  value: string;
}
