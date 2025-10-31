import { Hierarchy } from './hierarchy.interface';
import { VariableEntity } from './variable-entity.interface';

export interface Pathology {
  code: string;
  label: string;
  version: string;
  datasets: VariableEntity[];
  datasetsVariables: Record<string, string[]>;
  metadataHierarchy: Hierarchy;
  longitudinal: boolean;
}
