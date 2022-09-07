import { Experiment } from '../../../../models/experiment/experiment.model';
import { TableResult } from '../../../../models/result/table-result.model';
import { Variable } from '../../../../models/variable.model';
import BaseHandler from '../base.handler';

const lookupDict = {
  Estimate: 'Estimate',
  'Std. Error': 'Std. Error',
  'z-value': 'z-value',
  'p-value': 'p-value',
  'low0.95CI': 'Low 95% CI',
  'high0.95CI': 'High 95% CI',
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
  'low0.95CI',
  'high0.95CI',
];

const summaryProps = ['iter', 'Nvalid', 'Ntotal', 'df'];

export default class LinearRegressionHandler extends BaseHandler {
  canHandle(algorithm: string, data: any): boolean {
    return (
      algorithm.toLowerCase() === 'linear-regression' && data['coefficients']
    );
  }

  getSummaryTable(data: any): TableResult {
    const summaryTable: TableResult = {
      name: 'Summary',
      headers: [
        { name: 'Name', type: 'string' },
        { name: 'Value', type: 'string' },
      ],
      data: summaryProps.map((prop) => [lookupDict[prop], data[prop]]),
    };

    return summaryTable;
  }

  private getTableResult(data: any, vars: Variable[]): TableResult {
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
    const summaryResult = this.getSummaryTable(data);

    if (summaryResult) experiment.results.push(summaryResult);
    if (tableResult) experiment.results.push(tableResult);
  }
}
