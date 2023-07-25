import { Logger } from '@nestjs/common';
import { Category } from '../../../engine/models/category.model';
import { Dataset } from '../../../engine/models/dataset.model';
import { Domain } from '../../../engine/models/domain.model';
import {
  Experiment,
  ExperimentStatus,
} from '../../../engine/models/experiment/experiment.model';
import { Group } from '../../../engine/models/group.model';
import { Variable } from '../../../engine/models/variable.model';
import { AlgorithmParamInput } from '../../../experiments/models/input/algorithm-parameter.input';
import { ExperimentCreateInput } from '../../../experiments/models/input/experiment-create.input';
import handlers from './handlers';
import { Entity } from './interfaces/entity.interface';
import { ExperimentData } from './interfaces/experiment/experiment.interface';
import { Hierarchy } from './interfaces/hierarchy.interface';
import { VariableEntity } from './interfaces/variable-entity.interface';
import { transformToExperiment } from './transformations';
import { AlgorithmPreprocessingInput } from 'src/experiments/models/input/algorithm-preprocessing.input';
import e from 'express';

interface DataObject {
  [key: string]: string | DataObject | DataObject[]
}

const transformPreprocessingInputToData = (inputData: AlgorithmPreprocessingInput): DataObject => {

  const { name, parameters } = inputData;
  const transformedData: DataObject = { strategies: {} };

  parameters.forEach((parameter) => {
    const { id, value } = parameter
    if (id === 'visit1' || id === 'visit2') {
      transformedData[id] = value
    } else {
      transformedData['strategies'][id] = value
    }
  });

  return { [name]: transformedData };
};

export const dataToGroup = (data: Hierarchy): Group => {
  return {
    id: data.code,
    label: data.label,
    groups: data.groups
      ? data.groups.map(dataToGroup).map((group) => group.id)
      : [],
    variables: data.variables
      ? data.variables.map((v: VariableEntity) => v.code)
      : [],
  };
};

export const dataToCategory = (data: Entity): Category => {
  return {
    value: data.code,
    label: data.label,
  };
};

export const dataToDataset = (data: Entity): Dataset => {
  return {
    id: data.code,
    label: data.label,
    isLongitudinal: !!data.code.toLowerCase().includes('longitudinal'),
  };
};

//FIXME: Dirty workaround should be improved
const lookupTypes = {
  int: 'integer',
};

export const dataToVariable = (data: VariableEntity): Variable => {
  return {
    id: data.code,
    label: data.label,
    type: lookupTypes[data.type] ?? data.type,
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
    value: param.value,
  };
};

const getFormula = (data: ExperimentCreateInput) => {
  const formula =
    ((data.transformations?.length > 0 || data.interactions?.length > 0) && {
      single:
        data.transformations?.map((t) => ({
          var_name: t.id,
          unary_operation: t.operation,
        })) || [],
      interactions:
        data.interactions?.map((v) =>
          v.reduce((a, e, i) => ({ ...a, [`var${i + 1}`]: e }), {}),
        ) || [],
    }) ||
    null;

  return formula
    ? [
      {
        name: 'formula',
        value: JSON.stringify(formula),
      },
    ]
    : [];
};

const getVariables = (data: ExperimentCreateInput) => {
  if (!data.variables) return undefined;

  return {
    name: 'y',
    label: 'y',
    value: data.variables.join(','),
  };
};

const getCoVariables = (
  data: ExperimentCreateInput,
  design: { value: string },
) => {
  if (!data.coVariables || data.coVariables.length === 0) return undefined;
  let separator = ',';

  const excludes = [
    'Multiple Histograms',
    'CART',
    'ID3',
    'Naive Bayes Training',
  ];

  if (design && !excludes.includes(data.algorithm.id)) {
    separator = design.value === 'additive' ? '+' : '*';
  }

  return {
    name: 'x',
    label: 'x',
    value: data.coVariables.join(separator),
  };
};

export const experimentInputToData = (data: ExperimentCreateInput) => {
  const params = {
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
          value: data.filter ?? '',
        },
        {
          name: 'pathology',
          label: 'pathology',
          value: data.domain,
        },
        ...getFormula(data),
      ].concat(data.algorithm.parameters.map(algoParamInputToData)),
      preprocessing: data.algorithm.preprocessing.map(transformPreprocessingInputToData),
      type: data.algorithm.type ?? 'string',
      name: data.algorithm.id,
    },
    name: data.name,
  };

  if (data.algorithm.id === 'DESCRIPTIVE_STATS' && data.coVariables) {
    data.variables.push(...data.coVariables);
    data.coVariables = [];
  }

  const design = params.algorithm.parameters.find((p) => p.name === 'design');

  [getVariables(data), getCoVariables(data, design)]
    .filter((p) => p)
    .forEach((p) => params.algorithm.parameters.push(p));

  return params;
};

export const dataToExperiment = (
  data: ExperimentData,
  logger: Logger,
  domains?: Domain[],
): Experiment | undefined => {
  try {
    const expTransform = transformToExperiment.evaluate(data);

    const exp: Experiment = {
      ...expTransform,
      results: [],
    };

    const domain = domains?.find((d) => d.id === exp.domain);

    if (data && data.result && data.result.length)
      handlers(exp, data.result, domain);

    const allVariables = exp.filterVariables || [];

    // add filter variables
    const extractVariablesFromFilter = (filter: any): any =>
      filter.rules.forEach((r: any) => {
        if (r.rules) {
          extractVariablesFromFilter(r);
        }
        if (r.id) {
          allVariables.push(r.id);
        }
      });

    if (exp && exp.filter) {
      extractVariablesFromFilter(JSON.parse(exp.filter));
    }

    exp.filterVariables = Array.from(new Set(allVariables));

    return exp;
  } catch (e) {
    logger.error('Error parsing experiment', data.uuid);
    logger.debug(e);
    return {
      id: data.uuid,
      name: data.name,
      status: ExperimentStatus.ERROR,
      variables: [],
      domain: data['domain'] ?? '',
      results: [
        {
          rawdata: {
            type: 'text/plain+error',
            data: 'Error when parsing experiment data from the Engine',
          },
        },
      ],
      datasets: [],
      algorithm: {
        name: 'unknown',
      },
    };
  }
};
