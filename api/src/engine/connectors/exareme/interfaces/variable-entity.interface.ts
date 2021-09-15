import { Variable } from "./variable.interface";

export interface VariableEntity extends Variable {
    type?: 'nominal' | 'ordinal' | 'real' | 'integer' | 'text' | 'date';
    description?: string;
    enumerations?: Variable[];
    group?: Variable[];
    info?: string;
}