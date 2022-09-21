import { Domain } from '../../../../models/domain.model';
import { MIME_TYPES } from '../../../../../common/interfaces/utilities.interface';
import { Experiment } from '../../../../models/experiment/experiment.model';
import { RawResult } from '../../../../models/result/raw-result.model';
import { ResultExperiment } from '../../interfaces/experiment/result-experiment.interface';
import BaseHandler from '../base.handler';

const JSON_ALGO_LIST = ['cart', 'id3'];

export default class RawHandler extends BaseHandler {
  dataToRaw = (algo: string, result: ResultExperiment): RawResult => {
    let data = result;

    if (algo === 'cart') {
      data = { ...data, type: MIME_TYPES.JSONBTREE };
    }

    return { rawdata: data };
  };

  handle(exp: Experiment, data: unknown, domain: Domain): void {
    const inputs = data as ResultExperiment[];
    const algoName = exp.algorithm.name.toLowerCase();

    if (inputs && Array.isArray(inputs))
      inputs
        .filter((input) => !!input.data && !!input.type)
        .filter(
          (input) =>
            input.type !== MIME_TYPES.JSON || JSON_ALGO_LIST.includes(algoName),
        )
        .map((input) => this.dataToRaw(algoName, input))
        .forEach((input) => exp.results.push(input));

    super.handle(exp, data, domain);
  }
}
