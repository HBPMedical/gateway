import {
  AlertLevel,
  AlertResult,
} from '../../../../models/result/alert-result.model';
import {
  Experiment,
  ExperimentStatus,
} from '../../../../models/experiment/experiment.model';
import BaseHandler from '../base.handler';

export default class TerminalAlgorithmHandler extends BaseHandler {
  handle(experiment: Experiment): void {
    const alertResult: AlertResult = {
      level: AlertLevel.ERROR,
      message:
        "The algorithm's result cannot be processed by the engine. Either the algorithm is not supported or the result is not in the expected format.",
    };

    experiment.results.push(alertResult);
    experiment.status = ExperimentStatus.WARN;
  }
}
