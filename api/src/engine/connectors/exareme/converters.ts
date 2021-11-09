import { Category } from 'src/engine/models/category.model';
import { Algorithm } from 'src/engine/models/experiment/algorithm.model';
import { Experiment } from 'src/engine/models/experiment/experiment.model';
import { AlgorithmParamInput } from 'src/engine/models/experiment/input/algorithm-parameter.input';
import { ExperimentCreateInput } from 'src/engine/models/experiment/input/experiment-create.input';
import { Group } from 'src/engine/models/group.model';
import { ResultUnion } from 'src/engine/models/result/common/result-union.model';
import {
  GroupResult,
  GroupsResult,
} from 'src/engine/models/result/groups-result.model';
import { RawResult } from 'src/engine/models/result/raw-result.model';
import { Variable } from 'src/engine/models/variable.model';
import { Entity } from './interfaces/entity.interface';
import { ExperimentData } from './interfaces/experiment/experiment.interface';
import { ResultExperiment } from './interfaces/experiment/result-experiment.interface';
import { Hierarchy } from './interfaces/hierarchy.interface';
import { VariableEntity } from './interfaces/variable-entity.interface';
import {
  descriptiveModelToTables,
  descriptiveSingleToTables,
  transformToAlgorithms,
  transformToExperiment,
} from './transformations';

export const dataToGroup = (data: Hierarchy): Group => {
  return {
    id: data.code,
    label: data.label,
    groups: data.groups
      ? data.groups.map(dataToGroup).map((group) => group.id)
      : [],
    variables: data.variables
      ? data.variables.map((data: VariableEntity) => data.code)
      : [],
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

const algoParamInputToData = (param: AlgorithmParamInput) => {
  return {
    name: param.id,
    label: param.id,
    value: param.value.join(','),
  };
};

export const experimentInputToData = (data: ExperimentCreateInput) => {
  const formula =
    ((data.transformations?.length > 0 || data.interactions?.length > 0) && {
      single:
        data.transformations?.map((t) => ({
          var_name: t.name,
          unary_operation: t.operation,
        })) || [],
      interactions:
        data.interactions?.map((v) =>
          v.reduce((a, e, i) => ({ ...a, [`var${i + 1}`]: e }), {}),
        ) || [],
    }) ||
    null;

  return {
    algorithm: {
      parameters: [
        {
          name: 'dataset',
          label: 'dataset',
          value: data.datasets.join(','),
        },
        {
          name: 'filter',
          label: 'filter',
          value: data.filter,
        },
        {
          name: 'pathology',
          label: 'pathology',
          value: data.domain,
        },
        {
          name: 'y',
          label: 'y',
          value: data.variables.join(','),
        },
        ...(formula
          ? [
              {
                name: 'formula',
                value: JSON.stringify(formula),
              },
            ]
          : []),
      ].concat(data.algorithm.parameters.map(algoParamInputToData)),
      type: data.algorithm.type ?? 'string',
      name: data.algorithm.id,
    },
    name: data.name,
  };

  if (data.coVariables && data.coVariables.length) {
    params.algorithm.parameters.push({
      name: 'x',
      label: 'x',
      value: data.coVariables.join(','),
    });
  }

  return params;
};

export const descriptiveDataToTableResult = (
  data: ResultExperiment,
): GroupsResult[] => {
  const result = new GroupsResult();

  result.groups = [
    new GroupResult({
      name: 'Variables',
      description: 'Descriptive statistics for the variables of interest.',
      results: descriptiveSingleToTables.evaluate(data),
    }),
  ];

  result.groups.push(
    new GroupResult({
      name: 'Model',
      description:
        'Intersection table for the variables of interest as it appears in the experiment.',
      results: descriptiveModelToTables.evaluate(data),
    }),
  );

  return [result];
};

export const dataToExperiment = (data: ExperimentData): Experiment => {
  const expTransform = transformToExperiment.evaluate(data);

  const exp: Experiment = {
    ...expTransform,
    results: [],
  };

  exp.results = data.result
    ? data.result.map((result) => dataToResult(result, exp.algorithm.id)).flat()
    : [];

  return exp;
};

export const dataToAlgorithms = (data: string): Algorithm[] => {
  return transformToAlgorithms.evaluate(data);
};

export const dataToRaw = (result: ResultExperiment): RawResult[] => {
  return [
    {
      rawdata: result,
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
