import * as jsonata from 'jsonata'; // old import style needed due to 'export = jsonata'
import { Expression } from 'jsonata';
import { formatNumber } from '../../../../../common/utils/shared.utils';
import { Domain } from '../../../../models/domain.model';
import {
  TableResult,
  TableStyle,
} from '../../../../models/result/table-result.model';
import { Experiment } from '../../../../models/experiment/experiment.model';
import { HeatMapResult } from '../../../../models/result/heat-map-result.model';
import BaseHandler from '../base.handler';

type Lookup = {
  [key: string]: string;
};
export default class PearsonHandler extends BaseHandler {
  public static readonly ALGO_NAME = 'pearson_correlation';

  private static readonly transform: Expression = jsonata(`
  (
    $params := ['correlations'];
    $dictName := {
        "correlations": "Correlations",
        "p_values": "P values",
        "ci_lo": 'Low confidence intervals',
        "ci_hi": 'High confidence intervals'
    };

    $.$sift(function($v, $k) {$k in $params}).$each(function($v, $k) {
        {
            'name': $lookup($dictName, $k),
            'xAxis': {
                'categories': $v.variables.($lookup($$.lookupVars, $))
            },
            'yAxis': {
                'categories': $reverse($keys($v.$sift(function($val, $key) {$key ~> /^(?!variables$)/}))).($lookup($$.lookupVars, $))
            },
            'matrix': $v.$sift(function($val, $key) {$key ~> /^(?!variables$)/}).$each(function($val, $key) {$val})[]
            }
    })[]
  )`);

  private getTableResult(data: any, lookup: Lookup): TableResult {
    const elements = [...data['correlations']['variables']];
    const keys = [
      ...Object.keys(data['correlations']).filter((k) => k !== 'variables'),
    ];
    const tableData = [];
    const doneMap = {};

    while (keys.length > 0) {
      const key = keys.shift();
      elements.forEach((elem, i) => {
        const token = [key, elem].sort().join();
        if (elem === key || doneMap[token]) return;
        doneMap[token] = true;
        tableData.push([
          lookup[key] ?? key,
          lookup[elem] ?? elem,
          formatNumber(data['correlations'][key][i]),
          formatNumber(data['p_values'][key][i]),
          formatNumber(data['ci_lo'][key][i]),
          formatNumber(data['ci_hi'][key][i]),
        ]);
      });
    }

    const tableResult: TableResult = {
      name: 'Pearson summary',
      tableStyle: TableStyle.DEFAULT,
      headers: [
        { name: 'Variable 1', type: 'string' },
        { name: 'Variable 2', type: 'string' },
        { name: 'Correlation', type: 'string' },
        { name: 'P value', type: 'string' },
        { name: 'Low CI', type: 'string' },
        { name: 'High CI', type: 'string' },
      ],
      data: tableData,
    };

    return tableResult;
  }

  /**
   * This function returns true if the algorithm is Pearson.
   * @param {string} algorithm - The name of the algorithm to use.
   * @returns a boolean value.
   */
  canHandle(algorithm: string, data: any): boolean {
    return (
      algorithm.toLocaleLowerCase() === PearsonHandler.ALGO_NAME &&
      data &&
      data[0] &&
      data[0]['correlations'] &&
      data[0]['p_values']
    );
  }

  handle(exp: Experiment, data: any, domain: Domain): void {
    if (!this.canHandle(exp.algorithm.name, data))
      return super.handle(exp, data, domain);

    const extData = data[0];

    const varIds = [...exp.variables, ...(exp.coVariables ?? [])];
    const lookup: Lookup = varIds.reduce((acc, curr) => {
      acc[curr] = curr;
      return acc;
    }, {}); // fallback to original ids if domain is empty

    domain.variables
      .filter((v) => varIds.includes(v.id))
      .forEach((v) => {
        lookup[v.id] = v.label ?? v.id;
      });

    extData.lookupVars = lookup;
    const tableResult = this.getTableResult(extData, lookup);
    if (tableResult.data.length > 0) exp.results.push(tableResult);

    const results = PearsonHandler.transform.evaluate(
      extData,
    ) as HeatMapResult[];
    results
      .filter((heatMap) => heatMap.matrix.length > 0 && heatMap.name)
      .forEach((heatMap) => exp.results.push(heatMap));

    this.next?.handle(exp, data, domain);
  }
}
