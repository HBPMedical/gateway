import { isNumber } from '../../../../../common/utils/shared.utils';
import { Domain } from '../../../../models/domain.model';
import { Experiment } from '../../../../models/experiment/experiment.model';
import {
  TableResult,
  TableStyle,
} from '../../../../models/result/table-result.model';
import BaseHandler from '../base.handler';

const lookupDict = {
  dependent_var: 'Dependent variable',
  indep_vars: 'Independent variables',
  n_obs: 'Number of observations',
  df_resid: 'Residual degrees of freedom',
  df_model: 'Model degrees of freedom',
  coefficients: 'Coefficients',
  stderr: 'Std.Err.',
  z_scores: 'z-scores',
  pvalues: 'P{>|z|}',
  lower_ci: 'Lower 95% c.i.',
  upper_ci: 'Upper 59% c.i.',
  r_squared_mcf: 'McFadden R^2',
  r_squared_cs: 'Cox-Snell R^2',
  ll0: 'log(L) of null-model',
  ll: 'log(L)',
  aic: 'AIC',
  bic: 'BIC',
};
const EXCLUDE_NUMBER_LIST = ['n_obs', 'df_resid', 'df_model'];
const NUMBER_PRECISION = 4;
const roundNumber = (val: any, name: string) =>
  isNumber(val) && !EXCLUDE_NUMBER_LIST.includes(name)
    ? val.toPrecision(NUMBER_PRECISION)
    : val;

export default class LogisticRegressionHandler extends BaseHandler {
  private getModel(data: any): TableResult | undefined {
    return {
      name: 'Model',
      tableStyle: TableStyle.DEFAULT,
      headers: ['Name', 'Value'].map((name) => ({ name, type: 'string' })),
      data: [
        'dependent_var',
        'n_obs',
        'df_resid',
        'df_model',
        'df_model',
        'r_squared_mcf',
        'r_squared_cs',
        'll0',
        'll',
        'aic',
        'bic',
      ].map((name) => [lookupDict[name], roundNumber(data[name], name)]),
    };
  }

  private getCoefficients(data: any): TableResult | undefined {
    const fields = [
      'indep_vars',
      'coefficients',
      'stderr',
      'z_scores',
      'pvalues',
      'lower_ci',
      'upper_ci',
    ];

    return {
      name: 'Coefficients',
      tableStyle: TableStyle.DEFAULT,
      headers: fields.map((name) => ({
        name: lookupDict[name],
        type: 'string',
      })),
      data: [fields.map((name) => roundNumber(data[name], name))],
    };
  }

  canHandle(exp: Experiment, data: any): boolean {
    return (
      exp.algorithm.name.toLowerCase() === 'logistic_regression' &&
      !!data &&
      !!data[0] &&
      !!data[0]['summary']
    );
  }

  handle(experiment: Experiment, data: any, domain?: Domain): void {
    if (!this.canHandle(experiment, data))
      return super.handle(experiment, data, domain);

    const extractedData = {
      ...data[0],
      ...data[0]['summary'],
      summary: undefined,
    };

    const varIds = [...experiment.variables, ...(experiment.coVariables ?? [])];
    const variables = domain.variables.filter((v) => varIds.includes(v.id));

    let jsonData = JSON.stringify(extractedData);

    variables.forEach((v) => {
      const regEx = new RegExp(v.id, 'gi');
      jsonData = jsonData.replaceAll(regEx, v.label);
    });

    const improvedData = JSON.parse(jsonData);

    const model = this.getModel(improvedData);
    if (model) experiment.results.push(model);

    const coefs = this.getCoefficients(improvedData);
    if (coefs) experiment.results.push(coefs);
  }
}
