import { Variable } from '../../../../models/variable.model';

import { AlertLevel } from '../../../../models/result/alert-result.model';
import { Experiment } from '../../../../models/experiment/experiment.model';
import BaseHandler from '../base.handler';

export default class ErrorAlgorithmHandler extends BaseHandler {
  canHandle(data: any) {
    const errors = data.errorMessage;

    return errors && errors[0] && errors[0][0] && errors[0][0] !== 'No errors';
  }

  handle(experiment: Experiment, data: any, vars: Variable[]): void {
    if (!this.canHandle(data)) {
      return this.next?.handle(experiment, data, vars);
    }

    const errors = data.errorMessage as string[][];

    errors
      .filter((err) => err)
      .map((error) => ({
        level: AlertLevel.ERROR,
        message: error.join(' '),
      }))
      .forEach((error) => experiment.results.push(error));
  }
}
