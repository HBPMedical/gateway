import * as jsonata from 'jsonata'; // old import style needed due to 'export = jsonata'
import { Experiment } from '../../../../../engine/models/experiment/experiment.model';
import { ResultChartExperiment } from '../../interfaces/experiment/result-chart-experiment.interface';
import BaseHandler from '../base.handler';

export default class AreaHandler extends BaseHandler {
  private static readonly transform = jsonata(`
  ({
      "name": data.title.text,
      "xAxis": {
          "label": data.xAxis.title.text
      },
      "yAxis": {
          "label": data.yAxis.title.text
      },
      "lines": [
          {
              "label": "ROC curve",
              "x": data.series.data.$[0],
              "y": data.series.data.$[1],
              "type": 0
          }
      ]
  })
  `);

  canHandle(input: ResultChartExperiment): boolean {
    try {
      return (
        input.type === 'application/vnd.highcharts+json' &&
        input.data?.chart?.type === 'area'
      );
    } catch (e) {
      AreaHandler.logger.log('Error when parsing input from experiment');
      AreaHandler.logger.debug(e);
      return false;
    }
  }

  handle(exp: Experiment, data: unknown): void {
    let req = data;
    const inputs = data as ResultChartExperiment[];

    if (inputs && Array.isArray(inputs)) {
      inputs
        .filter(this.canHandle)
        .map((input) => AreaHandler.transform.evaluate(input))
        .forEach((input) => exp.results.push(input));

      req = JSON.stringify(inputs.filter((input) => !this.canHandle(input)));
    }

    this.next?.handle(exp, req);
  }
}
