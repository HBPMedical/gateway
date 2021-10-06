import { Category } from 'src/engine/models/category.model';
import { AlgorithmParameter } from 'src/engine/models/experiment/algorithm-parameter.model';
import { Experiment } from 'src/engine/models/experiment/experiment.model';
import { ExperimentCreateInput } from 'src/engine/models/experiment/input/experiment-create.input';
import { Group } from 'src/engine/models/group.model';
import { ResultUnion } from 'src/engine/models/result/common/result-union.model';
import { RawResult } from 'src/engine/models/result/raw-result.model';
import { TableResult } from 'src/engine/models/result/table-result.model';
import { Variable } from 'src/engine/models/variable.model';
import { Entity } from './interfaces/entity.interface';
import { ExperimentData } from './interfaces/experiment/experiment.interface';
import { ResultExperiment } from './interfaces/experiment/result-experiment.interface';
import { Hierarchy } from './interfaces/hierarchy.interface';
import { VariableEntity } from './interfaces/variable-entity.interface';
import { transformToExperiment, transientToTable } from './transformations';

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

const algoParamInputToData = (param: AlgorithmParameter) => {
  return {
    name: param.name,
    value: param.value.join(','),
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
          name: 'filter',
          value: data.filter,
        },
        {
          name: 'pathology',
          value: data.domain,
        },
        {
          name: 'y',
          value: data.variables.join(','),
        },
      ].concat(data.algorithm.parameters.map(algoParamInputToData)),
      type: data.algorithm.type ?? 'string',
      name: data.algorithm.name,
    },
    name: data.name,
  };
};

export const descriptiveDataToTableResult = (
  data: ResultExperiment,
): TableResult[] => {
  return transientToTable.evaluate(data);
};

export const dataToExperiment = (data: ExperimentData): Experiment => {
  const expTransform = transformToExperiment.evaluate(data);

  const exp: Experiment = {
    ...expTransform,
    results: [],
  };

  exp.results = data.result
    ? data.result
        .map((result) => dataToResult(result, exp.algorithm.name))
        .flat()
    : [];

  return exp;
};

export const dataToRaw = (result: ResultExperiment): RawResult[] => {
  return [
    {
      data: result.data,
    },
  ];
};

export const dataToResult = (
  result: ResultExperiment,
  algo: string,
): Array<typeof ResultUnion> => {
  switch (result.type.toLowerCase()) {
    case 'application/json':
      return dataJSONtoResult(result, algo);
    default:
      return dataToRaw(result);
  }
};

export const dataJSONtoResult = (
  result: ResultExperiment,
  algo: string,
): Array<typeof ResultUnion> => {
  switch (algo.toLowerCase()) {
    case 'descriptive_stats':
      return descriptiveDataToTableResult(result);
    default:
      return [];
  }
};
