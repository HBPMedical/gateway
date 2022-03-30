import { MIME_TYPES } from '../../../../../common/interfaces/utilities.interface';
import { Experiment } from '../../../../models/experiment/experiment.model';
import { RawResult } from '../../../../models/result/raw-result.model';
import { ResultExperiment } from '../../interfaces/experiment/result-experiment.interface';
import BaseHandler from '../base.handler';

export default class RawHandler extends BaseHandler {
  dataToRaw = (algo: string, result: ResultExperiment): RawResult => {
    let data = result;

    if (algo === 'CART') {
      data = { ...data, type: MIME_TYPES.JSONBTREE };
    }

    return { rawdata: data };
  };

  handle(exp: Experiment, data: unknown): void {
    const inputs = data as ResultExperiment[];

    if (inputs && Array.isArray(inputs))
      inputs
        .filter((input) => !!input.data && !!input.type)
        .map((input) => this.dataToRaw(exp.algorithm.id, input))
        .forEach((input) => exp.results.push(input));

    this.next?.handle(exp, data);
  }
}
