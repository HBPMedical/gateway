import { Field, ObjectType } from "@nestjs/graphql";
import { Category } from "./category.model";
import { Group } from "./group.model";

@ObjectType()
export class Variable {
    @Field()
    id: string;

    @Field({ nullable: true })
    label?: string;

    @Field()
    type: string;

    @Field({ nullable: true})
    description?: string;

    @Field(type => [Category])
    categories: Category[];

    @Field(type => Boolean)
    isCategorical: boolean;

    @Field(type => [Group])
    groups: Group[];
}