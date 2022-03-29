import * as jsonata from 'jsonata'; // old import style needed due to 'export = jsonata'
import { AlgoResults } from 'src/common/interfaces/utilities.interface';
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
    return (
      input.type === 'application/vnd.highcharts+json' &&
      input.data.chart.type === 'area'
    );
  }

  handle(algorithm: string, data: unknown, res: AlgoResults): void {
    let req = data;
    const inputs = data as ResultChartExperiment[];

    if (inputs) {
      inputs
        .filter(this.canHandle)
        .map((input) => AreaHandler.transform.evaluate(input))
        .forEach((input) => res.push(input));

      req = JSON.stringify(inputs.filter((input) => !this.canHandle(input)));
    }

    this.next?.handle(algorithm, req, res);
  }
}
