import { Domain } from '../../../../models/domain.model';
import { Variable } from '../../../../models/variable.model';
import { isNumber } from '../../../../../common/utils/shared.utils';
import { Experiment } from '../../../../models/experiment/experiment.model';
import {
  TableResult,
  TableStyle,
} from '../../../../models/result/table-result.model';
import BaseHandler from '../base.handler';

const NUMBER_PRECISION = 4;
const ALGO_NAME = 'linear_regression_cv';
const lookupDict = {
  dependent_var: 'Dependent variable',
  indep_vars: 'Independent variables',
  n_obs: 'Training set sample sizes',
  mean_sq_error: 'Root mean squared error',
  r_squared: 'R-squared',
  mean_abs_error: 'Mean absolute error',
};

export default class LinearRegressionCVHandler extends BaseHandler {
  private getModel(data: any): TableResult | undefined {
    return {
      name: 'Folds',
      tableStyle: TableStyle.DEFAULT,
      headers: ['', lookupDict['n_obs']].map((name) => ({
        name,
        type: 'string',
      })),
      data: data['n_obs'].map((size: string, i: number) => [
        'Fold ' + (i + 1),
        data['n_obs'][i],
      ]),
    };
  }

  private getScores(data: any): TableResult | undefined {
    return {
      name: 'Scores',
      tableStyle: TableStyle.DEFAULT,
      headers: ['', 'Mean', 'Standard deviation'].map((name) => ({
        name: name,
        type: 'string',
      })),
      data: ['mean_sq_error', 'r_squared', 'mean_abs_error'].map((variable) => [
        lookupDict[variable],
        ...data[variable].map((val: unknown) =>
          isNumber(val) ? val.toPrecision(NUMBER_PRECISION) : val,
        ),
      ]),
    };
  }

  getLabelFromVariableId(id: string, vars: Variable[]): string {
    const varible = vars.find((v) => v.id === id);
    return varible.label ?? id;
  }

  canHandle(exp: Experiment, data: any): boolean {
    return (
      exp.algorithm.name.toLowerCase() === ALGO_NAME &&
      data &&
      data[0] &&
      data[0].mean_sq_error &&
      data[0].r_squared
    );
  }

  handle(experiment: Experiment, data: any, domain: Domain): void {
    if (!this.canHandle(experiment, data))
      return super.handle(experiment, data, domain);

    const extractedData = data[0];

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

    const coefs = this.getScores(improvedData);
    if (coefs) experiment.results.push(coefs);
  }
}
