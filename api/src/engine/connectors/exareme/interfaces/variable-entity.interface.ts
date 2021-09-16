import { Entity } from './entity.interface';

export interface VariableEntity extends Entity {
  type?: 'nominal' | 'ordinal' | 'real' | 'integer' | 'text' | 'date';
  description?: string;
  enumerations?: Entity[];
  group?: Entity[];
  info?: string;
}
