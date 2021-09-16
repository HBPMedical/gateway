import { Category } from 'src/engine/models/category.model';
import { Group } from 'src/engine/models/group.model';
import { Variable } from 'src/engine/models/variable.model';
import { Hierarchy } from './interfaces/hierarchy.interface';
import { VariableEntity } from './interfaces/variable-entity.interface';
import { Entity } from './interfaces/entity.interface';

export const dataToGroup = (data: Hierarchy): Group => {
  return {
    id: data.code,
    label: data.label,
    groups: data.groups ? data.groups.map(dataToGroup) : [],
    variables: [],
  };
};

export const dataToCategory = (data: Entity): Category => {
  return {
    id: data.code,
    label: data.label,
  };
};

export const dataToVariable = (data: VariableEntity): Variable => {
  return {
    id: data.code,
    label: data.label,
    type: data.type,
    description: data.description,
    enumerations: data.enumerations
      ? data.enumerations.map(dataToCategory)
      : [],
    groups: [],
  };
};
