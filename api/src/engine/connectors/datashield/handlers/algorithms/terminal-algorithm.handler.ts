import { RawResult } from '../../../../models/result/raw-result.model';
import { Experiment } from '../../../../models/experiment/experiment.model';
import BaseHandler from '../base.handler';
import { MIME_TYPES } from '../../../../../common/interfaces/utilities.interface';

export default class TerminalAlgorithmHandler extends BaseHandler {
  handle(experiment: Experiment): void {
    const rawResult: RawResult = {
      rawdata: {
        type: MIME_TYPES.ERROR,
        data: "The algorithm's result cannot be processed by the engine. Either the algorithm is not supported or the result is not in the expected format.",
      },
    };

    experiment.results.push(rawResult);
  }
}
