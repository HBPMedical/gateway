import { isNumber } from '../../../../../common/utils/shared.utils';
import { Domain } from '../../../../models/domain.model';
import { Experiment } from '../../../../models/experiment/experiment.model';
import {
  TableResult,
  TableStyle,
} from '../../../../models/result/table-result.model';
import BaseHandler from '../base.handler';

const lookupDict = {
  t_stat: 't-value',
  n_obs: 'Number of observations',
  p: 'p-value',
  df: 'Degrees of freedom',
  mean_diff: 'Mean difference',
  se_diff: 'Standard error of difference',
  ci_lower: 'Lower 95% confidence interval',
  ci_upper: 'Upper 95% confidence interval',
  cohens_d: "Cohen's d",
};
const NUMBER_PRECISION = 4;
const EXCLUDE_PRECISION = ['n_obs', 'ci_lower', 'ci_upper'];

const isNumberPrecision = (value: any, name: string) => {
  if (!EXCLUDE_PRECISION.includes(name) && isNumber(value))
    return value.toPrecision(NUMBER_PRECISION);

  return value;
};

export default class TtestOnesampleHandler extends BaseHandler {
  public static readonly ALGO_NAME = 'ttest_onesample';

  private canHandle(algoId: string, data: any) {
    return (
      data &&
      data[0] &&
      data[0]['t_stat'] &&
      algoId.toLowerCase() === TtestOnesampleHandler.ALGO_NAME
    );
  }

  private getTable(data: any): TableResult {
    const tableModel: TableResult = {
      name: 'Results',
      tableStyle: TableStyle.DEFAULT,
      headers: ['name', 'value'].map((name) => ({ name, type: 'string' })),
      data: [
        'n_obs',
        't_stat',
        'p',
        'df',
        'mean_diff',
        'se_diff',
        'ci_lower',
        'ci_upper',
        'cohens_d',
      ].map((name) => [
        lookupDict[name],
        isNumberPrecision(data[name], name)
          ? data[name].toPrecision(NUMBER_PRECISION)
          : data[name],
      ]),
    };

    return tableModel;
  }

  handle(experiment: Experiment, data: any, domain?: Domain): void {
    if (!this.canHandle(experiment.algorithm.name, data))
      return super.handle(experiment, data, domain);

    const extData = data[0];

    const tableModel = this.getTable(extData);

    if (tableModel) experiment.results.push(tableModel);
  }
}
