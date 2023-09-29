import { Domain } from '../../../../models/domain.model';
import { Experiment } from '../../../../models/experiment/experiment.model';
import { HeatMapResult } from '../../../../models/result/heat-map-result.model';
import { TableResult } from '../../../../models/result/table-result.model';
import BaseHandler from '../base.handler';

const keys = ['accuracy', 'precision', 'recall', 'fscore'];

type InputData = {
  dependent_var: string;
  indep_vars: string[];
  confusion_matrix: Record<string, number>;
  classification_summary: Record<string, number[] | string[]>;
};

export default class NaiveBayesGaussianCVHandler extends BaseHandler {
  public static readonly ALGO_NAME = 'naive_bayes_gaussian_cv';

  private canHandle(experiment: Experiment, data: unknown): boolean {
    return (
      experiment.algorithm.name.toLowerCase() ===
      NaiveBayesGaussianCVHandler.ALGO_NAME
    );
  }

  getConfusionMatrix(data: InputData): HeatMapResult {
    const matrix: any = data['confusion_matrix'];

    return {
      name: 'Confusion matrix',
      matrix: matrix.data,
      xAxis: {
        categories: matrix.labels,
        label: 'Predicted class',
      },
      yAxis: {
        categories: matrix.labels,
        label: 'Actual Class',
      },
    };
  }

  round = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

  getClassificationSummary(data: InputData): TableResult {
    const headers = Object.keys(data.classification_summary);
    const subheaders = Object.keys(data.classification_summary.accuracy);
    const fullHeaders = keys.map((key) => [subheaders]).flatMap((x) => x);

    const firstColumnKeys = subheaders
      .filter((_, i) => i === 0)
      .map((key) => Object.keys(data.classification_summary.accuracy[key]))
      .flatMap((x) => x);

    return {
      name: 'Classification summary',
      headers: ['Fold', ...fullHeaders, 'n_obs'].map((key, i) => ({
        name: i > 0 || key !== 'n_obs' ? `${headers[i - 1]}: ${key}` : `${key}`,
        type: 'string',
      })),
      data: firstColumnKeys.map((k, i) => [
        k,
        ...[...fullHeaders, ['n_obs']].map((h, j) => {
          const headerKey = headers[j];
          let n;

          if (headerKey !== 'n_obs') {
            n = h.map((h) =>
              this.round(data.classification_summary[headerKey][h][k]),
            );
          } else {
            n = h.map((h) => data.classification_summary['n_obs'][k]);
          }

          return `${n}`;
        }),
      ]),
    };
  }

  handle(experiment: Experiment, data: unknown, domain?: Domain): void {
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
      this.getConfusionMatrix(improvedData),
      this.getClassificationSummary(improvedData),
    ];

    results
      .filter((r) => !!r)
      .forEach((r) => {
        experiment.results.push(r);
      });
  }
}
