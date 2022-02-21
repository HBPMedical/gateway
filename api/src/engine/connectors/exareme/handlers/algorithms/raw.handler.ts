import {
  AlgoResults,
  MIME_TYPES,
} from 'src/common/interfaces/utilities.interface';
import { RawResult } from 'src/engine/models/result/raw-result.model';
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

  handle(algorithm: string, data: unknown, res: AlgoResults): void {
    const inputs = data as ResultExperiment[];

    inputs
      .map((input) => this.dataToRaw(algorithm, input))
      .forEach((input) => res.push(input));

    this.next?.handle(algorithm, data, res);
  }
}
