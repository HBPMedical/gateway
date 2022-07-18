import { MIME_TYPES } from 'src/common/interfaces/utilities.interface';
import { Category } from 'src/engine/models/category.model';
import { Dataset } from 'src/engine/models/dataset.model';
import {
  Experiment,
  ExperimentStatus,
} from 'src/engine/models/experiment/experiment.model';
import { Group } from 'src/engine/models/group.model';
import { ResultUnion } from 'src/engine/models/result/common/result-union.model';
import {
  GroupResult,
  GroupsResult,
} from 'src/engine/models/result/groups-result.model';
import { HeatMapResult } from 'src/engine/models/result/heat-map-result.model';
import { LineChartResult } from 'src/engine/models/result/line-chart-result.model';
import { RawResult } from 'src/engine/models/result/raw-result.model';
import { Variable } from 'src/engine/models/variable.model';
import { AlgorithmParamInput } from 'src/experiments/models/input/algorithm-parameter.input';
import { ExperimentCreateInput } from 'src/experiments/models/input/experiment-create.input';
import { Entity } from './interfaces/entity.interface';
import { ExperimentData } from './interfaces/experiment/experiment.interface';
import { ResultChartExperiment } from './interfaces/experiment/result-chart-experiment.interface';
import { ResultExperiment } from './interfaces/experiment/result-experiment.interface';
import { Hierarchy } from './interfaces/hierarchy.interface';
import { VariableEntity } from './interfaces/variable-entity.interface';
import {
  dataROCToLineResult,
  dataToHeatmap,
  descriptiveModelToTables,
  descriptiveSingleToTables,
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
    value: param.value,
  };
};

export const experimentInputToData = (data: ExperimentCreateInput) => {
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
          value: data.filter,
        },
        {
          name: 'pathology',
          label: 'pathology',
          value: data.domain,
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
    let separator = ',';

    const design = params.algorithm.parameters.find((p) => p.name === 'design');
    const excludes = [
      'Multiple Histograms',
      'CART',
      'ID3',
      'Naive Bayes Training',
    ];

    if (design && !excludes.includes(data.algorithm.id)) {
      separator = design.value === 'additive' ? '+' : '*';
    }

    params.algorithm.parameters.push({
      name: 'x',
      label: 'x',
      value: data.coVariables.join(separator),
    });
  }

  if (data.variables) {
    let variables = data.variables.join(',');

    if (data.algorithm.id === 'TTEST_PAIRED') {
      const varCount = data.variables.length;
      variables = data.variables
        ?.reduce(
          (vectors: string, v, i) =>
            (i + 1) % 2 === 0
              ? `${vectors}${v},`
              : varCount === i + 1
              ? `${vectors}${v}-${data.variables[0]}`
              : `${vectors}${v}-`,
          '',
        )
        .replace(/,$/, '');
    }

    params.algorithm.parameters.push({
      name: 'y',
      label: 'y',
      value: variables,
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

export const dataToExperiment = (
  data: ExperimentData,
): Experiment | undefined => {
  try {
    const expTransform = transformToExperiment.evaluate(data);

    const exp: Experiment = {
      ...expTransform,
      results: [],
    };

    exp.results = data.result
      ? data.result
          .map((result) => dataToResult(result, exp.algorithm.name))
          .filter((r) => r.length > 0)
          .flat()
      : [];

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

export const dataToRaw = (
  algo: string,
  result: ResultExperiment,
): RawResult[] => {
  let data = result;

  if (algo === 'CART') {
    data = { ...data, type: MIME_TYPES.JSONBTREE };
  }

  return [
    {
      rawdata: data,
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
    case 'application/vnd.highcharts+json':
      return dataHighchartToResult(result as ResultChartExperiment, algo);
    default:
      return dataToRaw(algo, result);
  }
};

export const dataJSONtoResult = (
  result: ResultExperiment,
  algo: string,
): Array<typeof ResultUnion> => {
  switch (algo.toLowerCase()) {
    case 'cart':
    case 'id3':
      return dataToRaw(algo, result);
    case 'descriptive_stats':
      return descriptiveDataToTableResult(result);
    default:
      return [];
  }
};

export const dataHighchartToResult = (
  result: ResultChartExperiment,
  algo: string,
): Array<typeof ResultUnion> => {
  switch (result.data.chart.type) {
    case 'heatmap':
      return [dataToHeatmap.evaluate(result) as HeatMapResult];
    case 'area':
      return [dataROCToLineResult.evaluate(result) as LineChartResult];
    default:
      return dataToRaw(algo, result);
  }
};
