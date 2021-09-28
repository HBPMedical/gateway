import { Category } from 'src/engine/models/category.model';
import { Group } from 'src/engine/models/group.model';
import { Variable } from 'src/engine/models/variable.model';
import { Hierarchy } from './interfaces/hierarchy.interface';
import { VariableEntity } from './interfaces/variable-entity.interface';
import { Entity } from './interfaces/entity.interface';
import { ExperimentCreateInput } from 'src/engine/models/experiment/experiment-create.input';
import { TransientDataResult } from './interfaces/transient/transient-data-result.interface';
import { Experiment } from 'src/engine/models/experiment/experiment.model';
import { MetaData } from 'src/engine/models/result/common/metadata.model';
import { TableResult } from 'src/engine/models/result/table-result.model';
import { Dictionary } from 'src/common/interfaces/utilities.interface';
import { table } from 'console';

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

const dictToTable = (dict: Dictionary<string[]>, rows: number): string[][] => {
  const keys = Object.keys(dict);

  return keys.map((key) => {
    const row = Array.from(Array(rows).keys())
      .map((i) => dict[key][i])
      .map((val) => val ?? '');
    row.unshift(key);
    return row;
  });
};

export const dataToTransient = (data: TransientDataResult): Experiment => {
  const result = data.result[0];
  const tables = Object.keys(result.data.single).map((varKey): TableResult => {
    const variable = result.data.single[varKey];
    const domains: MetaData[] = [];
    const rows: Dictionary<string[]> = {};

    let count = 0;

    Object.keys(variable).map((domainKey) => {
      domains.push({ name: domainKey, type: 'string' });
      const data = variable[domainKey];

      [
        [varKey, 'num_total'],
        ['datapoints', 'num_datapoints'],
        ['nulls', 'num_nulls'],
      ].forEach((keys) => {
        if (!rows[keys[0]]) rows[keys[0]] = [];
        rows[keys[0]][count] = data[keys[1]];
      });

      const properties = variable[domainKey].data;

      Object.keys(properties).forEach((propKey) => {
        if (!rows[propKey]) rows[propKey] = [];
        rows[propKey][count] = properties[propKey].toString();
      });

      count++;
    });

    return {
      data: dictToTable(rows, count),
      metadatas: domains,
      name: varKey,
      groupBy: 'single',
    };
  });

  const result2 = tables.map((table) => {
    const nTable = Object.assign({}, table);
    nTable.groupBy = 'Model';
    return nTable;
  });

  return {
    title: data.name,
    results: tables.concat(result2),
  };
};
