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
  summary: Record<string, number[] | string[]>;
  confusion_matrix: Record<string, number>;
  roc_curves: LineCurve[];
};

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

  getSummary(data: InputData): TableResult {
    return {
      name: 'Summary',
      headers: ['blank', ...keys].map((key) => ({
        name: lookupDict[key],
        type: 'string',
      })),
      data: data.summary['row_names'].map((key: any, i: number) => [
        key,
        ...keys.map((k) => `${data['summary'][k][i]}`),
      ]),
    };
  }

  getConfusionMatrix(data: InputData): HeatMapResult {
    const matrix = data['confusion_matrix'];

    return {
      name: 'Confusion matrix',
      matrix: [
        [matrix['tp'], matrix['fp']],
        [matrix['fn'], matrix['tn']],
      ],
      xAxis: {
        categories: ['Positive', 'Negative'],
        label: 'Actual Values',
      },
      yAxis: {
        categories: ['Negative', 'Positive'],
        label: 'Predicted Values',
      },
    };
  }

  getROC(data: InputData): LineChartResult {
    return {
      name: 'ROC Curves',
      lines: data.roc_curves.map((line: LineCurve) => {
        return {
          label: `${line.name} (AUC: ${line.auc.toPrecision(
            NUMBER_PRECISION,
          )})`,
          x: line.fpr,
          y: line.tpr,
        } as LineResult;
      }),
      xAxis: {
        label: 'False Positive Rate',
      },
      yAxis: {
        label: 'True Positive Rate',
      },
      hasBisector: true,
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
      this.getSummary(improvedData),
      this.getConfusionMatrix(improvedData),
      this.getROC(improvedData),
    ];

    results
      .filter((r) => !!r)
      .forEach((r) => {
        experiment.results.push(r);
      });
  }
}
