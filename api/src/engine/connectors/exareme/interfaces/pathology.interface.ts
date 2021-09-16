import { Hierarchy } from './hierarchy.interface';
import { VariableEntity } from './variable-entity.interface';

export interface Pathology {
  code: string;
  label: string;
  datasets: VariableEntity[];
  metadataHierarchy: Hierarchy;
}
