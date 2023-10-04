import { Domain } from '../../../../models/domain.model';
import { Experiment } from '../../../../models/experiment/experiment.model';
import BaseHandler from '../base.handler';
import { ClusterResult } from '../../../../models/result/cluster-result.model';
import { TableResult } from 'src/engine/models/result/table-result.model';

const ALGO_NAME = 'kmeans';

export default class KMeansHandler extends BaseHandler {
  canHandle(exp: Experiment, data: any): boolean {
    return exp.algorithm.name.toLowerCase() === ALGO_NAME;
  }

  getCluster(data: any): ClusterResult {
    const matrix = data.centers;

    // 2d matrix
    if (matrix[0].length === 2) {
      return {
        name: data.title,
        nmatrix: matrix.reduce(
          (acc, val) => {
            acc[0].push(val[0]);
            acc[1].push(val[1]);
            return acc;
          },
          [[], []],
        ),
      };
    }

    return {
      name: data.title,
      nmatrix: data.centers,
    };
  }

  getTable(data: any): TableResult {
    return {
      name: `Results for k=(${data.length})`,
      headers: data[0].map(() => ({ name: '', type: 'string' })),
      data,
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

    const results = [
      this.getCluster(improvedData),
      this.getTable(improvedData.centers),
    ];

    results
      .filter((r) => !!r)
      .forEach((r) => {
        experiment.results.push(r);
      });
  }
}
