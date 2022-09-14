import { Domain } from '../../../../models/domain.model';
import { Experiment } from '../../../../models/experiment/experiment.model';
import BaseHandler from '../base.handler';

export default class LogisticRegressionCVHandler extends BaseHandler {
  public static readonly ALGO_NAME = 'logistic_regression_cv';

  private canHandle(experiment: Experiment, data: unknown): boolean {
    return (
      experiment.algorithm.name.toLowerCase() ===
        LogisticRegressionCVHandler.ALGO_NAME &&
      !!data &&
      !!data[0] &&
      !!data[0]['summary']
    );
  }

  handle(experiment: Experiment, data: unknown, domain?: Domain): void {
    if (!this.canHandle(experiment, data))
      return super.handle(experiment, data, domain);
  }
}
