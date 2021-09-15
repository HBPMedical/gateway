import { VariableEntity } from "./variable-entity.interface";

export interface Hierarchy {
    code: string;
    label: string;
    groups: Hierarchy[];
    variables: VariableEntity[];
}