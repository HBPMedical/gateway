import * as jsonata from 'jsonata'; // old import style needed due to 'export = jsonata'
import { MeanChartResult } from 'src/engine/models/result/means-chart-result.model';
import { Experiment } from '../../../../models/experiment/experiment.model';
import {
  TableResult,
  TableStyle,
} from '../../../../models/result/table-result.model';
import BaseHandler from '../base.handler';

export default class AnovaOneWayHandler extends BaseHandler {
  private static readonly tuckeyTransform = jsonata(`
    {
        "name": 'Tuckey Honest Significant Differences',
        "headers": [
            {"name": 'A', "type": 'string'},
            {"name": 'B', "type": 'string'},
            {"name": 'Mean A', "type": 'string'},
            {"name": 'Mean B', "type": 'string'},
            {"name": 'Diff', "type": 'string'},
            {"name": 'Standard error', "type": 'string'},
            {"name": 'T value', "type": 'string'},
            {"name": 'P value', "type": 'string'}     
        ],
        "data": tuckey_test.[$.groupA, $.groupB, $.meanA, $.meanB, $.diff, $.se, $.t_stat, $.p_tuckey]
    }
  `);

  private static readonly meanPlotTransform = jsonata(`
  (
    $cats:= $keys(ci_info.means);
    {
    "name": "Mean Plot: " & y_label & ' ~ ' & x_label,
    "xAxis": {
        "label": x_label,
        "categories": $cats
    },
    "yAxis": {
        "label": '95% CI: ' & y_label
    },
    "pointCIs": $cats.[{
        "min": $lookup($$.ci_info.'m-s', $),
        "mean": $lookup($$.ci_info.means, $),
        "max": $lookup($$.ci_info.'m+s', $)
    }]
  })
  `);

  canHandle(algorithm: string): boolean {
    return algorithm.toLocaleLowerCase() === 'anova_oneway';
  }

  getTuckeyTable(data: unknown): TableResult | undefined {
    const tableData = AnovaOneWayHandler.tuckeyTransform.evaluate(data);

    if (!tableData) return undefined;

    const tableResult: TableResult = {
      ...tableData,
      tableStyle: TableStyle.NORMAL,
    } as unknown as TableResult;

    return tableResult;
  }

  getSummaryTable(data: unknown, varname: string): TableResult | undefined {
    const tableSummary: TableResult = {
      name: 'Annova summary',
      tableStyle: TableStyle.NORMAL,
      headers: ['', 'DF', 'SS', 'MS', 'F ratio', 'P value'].map((name) => ({
        name,
        type: 'string',
      })),
      data: [
        [
          varname,
          data['df_explained'],
          data['ss_explained'],
          data['ms_explained'],
          data['p_value'],
          data['f_stat'],
        ],
        [
          'Residual',
          data['df_residual'],
          data['ss_residual'],
          data['ms_residual'],
          '',
          '',
        ],
      ],
    };

    return tableSummary;
  }

  getMeanPlot(data: unknown): MeanChartResult {
    return AnovaOneWayHandler.meanPlotTransform.evaluate(data);
  }

  handle(exp: Experiment, data: unknown): void {
    if (!this.canHandle(exp.algorithm.name)) return super.handle(exp, data);

    const summaryTable = this.getSummaryTable(data, exp.coVariables[0]);
    if (summaryTable) exp.results.push(summaryTable);

    const tuckeyTable = this.getTuckeyTable(data);
    if (tuckeyTable) exp.results.push(tuckeyTable);

    const meanPlot = this.getMeanPlot(data);
    if (meanPlot && meanPlot.pointCIs) exp.results.push(meanPlot);

    super.handle(exp, data); // continue request
  }
}
