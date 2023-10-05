import { Domain } from '../../../../models/domain.model';
import { Experiment } from '../../../../models/experiment/experiment.model';
import BaseHandler from '../base.handler';
import { RawResult } from 'src/engine/models/result/raw-result.model';

const ALGO_NAME = 'svm_scikit';

export default class SVMHandler extends BaseHandler {
  canHandle(exp: Experiment, data: any): boolean {
    return exp.algorithm.name.toLowerCase() === ALGO_NAME;
  }

  getRawData(data: any): RawResult {
    return {
      rawdata: { type: 'application/json', data },
    };
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

    const results = [this.getRawData(improvedData)];

    results
      .filter((r) => !!r)
      .forEach((r) => {
        experiment.results.push(r);
      });
  }
}
