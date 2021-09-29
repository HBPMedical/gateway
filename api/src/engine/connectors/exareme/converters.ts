import { Category } from 'src/engine/models/category.model';
import { ExperimentCreateInput } from 'src/engine/models/experiment/experiment-create.input';
import { Experiment } from 'src/engine/models/experiment/experiment.model';
import { Group } from 'src/engine/models/group.model';
import { TableResult } from 'src/engine/models/result/table-result.model';
import { Variable } from 'src/engine/models/variable.model';
import { Entity } from './interfaces/entity.interface';
import { Hierarchy } from './interfaces/hierarchy.interface';
import { TransientDataResult } from './interfaces/transient/transient-data-result.interface';
import { VariableEntity } from './interfaces/variable-entity.interface';
import { transientToTable } from './transformations';

export const dataToGroup = (data: Hierarchy): Group => {
  return {
    id: data.code,
    label: data.label,
    groups: data.groups ? data.groups.map(dataToGroup) : [],
    variables: data.variables ? data.variables.map(dataToVariable) : [],
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

export const experimentInputToData = (data: ExperimentCreateInput) => {
  return {
    algorithm: {
      parameters: [
        {
          name: 'dataset',
          value: data.datasets.join(','),
        },
        {
          name: 'y',
          value: data.variables.join(','),
        },
        {
          name: 'filter',
          value: data.filter,
        },
        {
          name: 'pathology',
          value: data.domain,
        },
      ],
      type: 'string',
      name: data.algorithm,
    },
    name: data.name,
  };
};

export const dataToTransient = (data: TransientDataResult): Experiment => {
  const tabs: TableResult[] = transientToTable.evaluate(data);

  return {
    title: data.name,
    results: tabs,
  };
};
