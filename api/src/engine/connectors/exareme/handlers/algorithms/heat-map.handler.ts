import { AlgoResults } from 'src/common/interfaces/utilities.interface';
import { ResultChartExperiment } from '../../interfaces/experiment/result-chart-experiment.interface';
import BaseHandler from '../base.handler';
import * as jsonata from 'jsonata'; // old import style needed due to 'export = jsonata'

export default class HeatMapHandler extends BaseHandler {
  private static readonly transform = jsonata(`
  (
      {
          "name": data.title.text,
          "xAxis": {
              "categories": data.xAxis.categories,
              "label": data.xAxis.label
          },
          "yAxis": {
              "categories": data.yAxis.categories,
              "label": data.yAxis.label
          },
          "matrix": $toMat(data.series.data)
      }
  )
  `);

  canHandle(input: ResultChartExperiment): boolean {
    return (
      input.type.toLowerCase() === 'application/vnd.highcharts+json' &&
      input.data.chart.type.toLowerCase() === 'heatmap'
    );
  }

  handle(algorithm: string, data: unknown, res: AlgoResults): void {
    let req = data;
    const inputs = data as ResultChartExperiment[];

    if (inputs) {
      inputs
        .filter(this.canHandle)
        .map((input) => HeatMapHandler.transform.evaluate(input))
        .forEach((input) => res.push(input));

      req = JSON.stringify(inputs.filter((input) => !this.canHandle(input)));
    }

    this.next?.handle(algorithm, req, res);
  }
}
