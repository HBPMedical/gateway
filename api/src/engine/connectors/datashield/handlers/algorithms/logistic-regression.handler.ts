import { Experiment } from '../../../../models/experiment/experiment.model';
import { TableResult } from '../../../../models/result/table-result.model';
import { Variable } from '../../../../models/variable.model';
import BaseHandler from '../base.handler';

const lookupDict = {
  Estimate: 'Estimate',
  'Std. Error': 'Std. Error',
  'z-value': 'z-value',
  'p-value': 'p-value',
  'low0.95CI.LP': 'Low 95% CI',
  'high0.95CI.LP': 'High 95% CI',
  P_OR: 'P OR',
  'low0.95CI.P_OR': 'Low 95% CI P_OR',
  'high0.95CI.P_OR': 'High 95% CI P OR',
  _row: '',
  iter: 'Iteration(s)',
  Nvalid: 'Valid observations',
  Ntotal: 'Total observations',
  df: 'Degrees of freedom',
};

const properties = [
  '_row',
  'Estimate',
  'Std. Error',
  'z-value',
  'p-value',
  'low0.95CI.LP',
  'high0.95CI.LP',
  // 'P_OR', // What is P_OR? Not defined in the ds' documentation
  // 'low0.95CI.P_OR',
  // 'high0.95CI.P_OR',
];

const summaryProps = ['iter', 'Nvalid', 'Ntotal', 'df'];

export default class LogisticRegressionHandler extends BaseHandler {
  canHandle(algorithm: string, data: any): boolean {
    return (
      algorithm.toLowerCase() === 'logistic-regression' &&
      !!data['coefficients']
    );
  }

  getSummaryTable(data: any): TableResult {
    return {
      name: 'Summary',
      headers: [
        { name: 'Name', type: 'string' },
        { name: 'Value', type: 'string' },
      ],
      data: summaryProps.map((prop) => [lookupDict[prop], data[prop]]),
    };
  }

  getTableResult(data: unknown, vars: Variable[]): TableResult {
    return {
      name: 'Results',
      headers: properties.map((name) => ({
        name: lookupDict[name],
        type: 'string',
      })),
      data: data['coefficients'].map((row: any) => {
        const variable = vars.find((v) => v.id === row['_row']);
        if (variable) row['_row'] = variable.label ?? variable.id;
        return properties.map((name) => row[name]);
      }),
    };
  }

  handle(experiment: Experiment, data: unknown, vars: Variable[]): void {
    if (!this.canHandle(experiment.algorithm.name, data))
      return this.next?.handle(experiment, data, vars);

    const tableResult = this.getTableResult(data, vars);
    const summaryTable = this.getSummaryTable(data);

    if (summaryTable) experiment.results.push(summaryTable);
    if (tableResult) experiment.results.push(tableResult);
  }
}
