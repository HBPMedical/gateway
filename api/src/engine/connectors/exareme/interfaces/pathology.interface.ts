import { Hierarchy } from './hierarchy.interface';
import { VariableEntity } from './variable-entity.interface';

export interface Pathology {
  code: string;
  label: string;
  version: string;
  datasets: VariableEntity[];
  metadataHierarchy: Hierarchy;
  longitudinal: boolean;
}
