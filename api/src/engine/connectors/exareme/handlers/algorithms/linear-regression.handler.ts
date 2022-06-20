import { isNumber } from '../../../../../common/utils/shared.utils';
import { Experiment } from '../../../../models/experiment/experiment.model';
import {
  TableResult,
  TableStyle,
} from '../../../../models/result/table-result.model';
import BaseHandler from '../base.handler';

const NUMBER_PRECISION = 4;
const ALGO_NANE = 'linear_regression';
const lookupDict = {
  dependent_var: 'Dependent variable',
  n_obs: 'Number of observations',
  df_resid: 'Residual degrees of freedom',
  df_model: 'Model degrees of freedom',
  rse: 'Residual standard error',
  r_squared: 'R-squared',
  r_squared_adjusted: 'Adjusted R-squared',
  f_stat: 'F statistic',
  f_pvalue: 'P{>F}',
  indep_vars: 'Independent variables',
  coefficients: 'Coefficients',
  std_err: 'Std.Err.',
  t_stats: 't-statistics',
  pvalues: 'P{>|t|}',
  lower_ci: 'Lower 95% c.i.',
  upper_ci: 'Upper 95% c.i.',
};

export default class LinearRegressionHandler extends BaseHandler {
  private getModel(data: any): TableResult | undefined {
    const excepts = ['n_obs'];
    const tableModel: TableResult = {
      name: 'Model',
      tableStyle: TableStyle.NORMAL,
      headers: ['name', 'value'].map((name) => ({ name, type: 'string' })),
      data: [
        'dependent_var',
        'n_obs',
        'df_resid',
        'df_model',
        'rse',
        'r_squared',
        'r_squared_adjusted',
        'f_stat',
        'f_pvalue',
      ].map((name) => [
        lookupDict[name],
        isNumber(data[name]) && !excepts.includes(name)
          ? data[name].toPrecision(NUMBER_PRECISION)
          : data[name],
      ]),
    };

    return tableModel;
  }

  private getCoefficients(data: any): TableResult | undefined {
    const keys = [
      'indep_vars',
      'coefficients',
      'std_err',
      't_stats',
      'pvalues',
      'lower_ci',
      'upper_ci',
    ];
    const tabKeys = keys.slice(1);

    const tableCoef: TableResult = {
      name: 'Coefficients',
      tableStyle: TableStyle.NORMAL,
      headers: keys.map((name) => ({
        name: lookupDict[name],
        type: 'string',
      })),
      data: data.indep_vars.map((variable, i) => {
        const row = tabKeys
          .map((key) => data[key][i])
          .map((val) =>
            isNumber(val) ? val.toPrecision(NUMBER_PRECISION) : val,
          );
        row.unshift(variable);
        return row;
      }),
    };

    return tableCoef;
  }

  handle(experiment: Experiment, data: any): void {
    if (experiment.algorithm.name.toLowerCase() !== ALGO_NANE)
      return super.handle(experiment, data);

    const model = this.getModel(data);
    if (model) experiment.results.push(model);

    const coefs = this.getCoefficients(data);
    if (coefs) experiment.results.push(coefs);
  }
}
