import * as jsonata from 'jsonata'; // old import style needed due to 'export = jsonata'
import { Experiment } from '../../../../models/experiment/experiment.model';
import { ResultChartExperiment } from '../../interfaces/experiment/result-chart-experiment.interface';
import BaseHandler from '../base.handler';

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

  handle(exp: Experiment, data: unknown): void {
    let req = data;
    const inputs = data as ResultChartExperiment[];

    if (inputs && Array.isArray(inputs)) {
      inputs
        .filter(this.canHandle)
        .map((input) => HeatMapHandler.transform.evaluate(input))
        .forEach((input) => exp.results.push(input));

      req = JSON.stringify(inputs.filter((input) => !this.canHandle(input)));
    }

    this.next?.handle(exp, req);
  }
}
