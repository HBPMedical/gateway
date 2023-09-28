import { Domain } from '../../../../models/domain.model';
import { Experiment } from '../../../../models/experiment/experiment.model';
import { HeatMapResult } from '../../../../models/result/heat-map-result.model';
import {
  LineChartResult,
  LineResult,
} from '../../../../models/result/line-chart-result.model';

import { TableResult } from '../../../../models/result/table-result.model';
import BaseHandler from '../base.handler';

const NUMBER_PRECISION = 4;

const lookupDict = {
  dependent_var: 'Dependent variable',
  indep_vars: 'Independent variables',
  n_obs: 'Number of observations',
  fscore: 'F-score',
  accuracy: 'Accuracy',
  precision: 'Precision',
  recall: 'Recall',
  average: 'Average',
  stdev: 'Standard deviation',
  blank: '',
};

const keys = ['n_obs', 'accuracy', 'recall', 'precision', 'fscore'];

type LineCurve = {
  name: string;
  tpr: number[];
  fpr: number[];
  auc: number;
};

type InputData = {
  dependent_var: string;
  indep_vars: string[];
  confusion_matrix: Record<string, number>;
  classification_summary: Record<string, number[] | string[]>;
};

export default class NaiveBayesGaussianCVHandler extends BaseHandler {
  public static readonly ALGO_NAME = 'naive_bayes_gaussian_cv';

  private canHandle(experiment: Experiment, data: unknown): boolean {
    console.log(experiment.algorithm.name.toLowerCase());
    return (
      experiment.algorithm.name.toLowerCase() ===
      NaiveBayesGaussianCVHandler.ALGO_NAME
    );
  }

  getConfusionMatrix(data: InputData): HeatMapResult {
    const matrix:any = data['confusion_matrix'];

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

  getClassificationSummary(data: InputData): TableResult {
    return {
      name: 'Summary',
      headers: ['blank', ...keys].map((key) => ({
        name: lookupDict[key],
        type: 'string',
      })),
      data: Object.keys(data.classification_summary).map(k => [
        JSON.stringify(data.classification_summary[k]  ),
      ])
      // data: ['row_names'].map((key: any, i: number) => [
      //   key,
      //   ...keys.map((k) => `${data['summary'][k][i]}`),
      // ]),
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
    console.log(improvedData);

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
