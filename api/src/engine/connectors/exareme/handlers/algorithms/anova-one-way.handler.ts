import * as jsonata from 'jsonata'; // old import style needed due to 'export = jsonata'
import { Domain } from 'src/engine/models/domain.model';
import { MeanChartResult } from 'src/engine/models/result/means-chart-result.model';
import { Experiment } from '../../../../models/experiment/experiment.model';
import {
  TableResult,
  TableStyle,
} from '../../../../models/result/table-result.model';
import BaseHandler from '../base.handler';

const ALGO_NAME = 'one_way_anova';

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
        "data": tuckey_test.[$.groupA, $.groupB, $.meanA, $.meanB, $.diff, $.se, $.t_stat, $.p_tuckey][]
    }
  `);

  private static readonly meanPlotTransform = jsonata(`
  (
    $cats:= $keys(ci_info.means);
    {
    "name": "Mean Plot: " & anova_table.y_label & ' ~ ' & anova_table.x_label,
    "xAxis": {
        "label": anova_table.x_label,
        "categories": $cats
    },
    "yAxis": {
        "label": '95% CI: ' & anova_table.y_label
    },
    "pointCIs": $cats.{
        "min": $lookup($$.ci_info.'m-s', $),
        "mean": $lookup($$.ci_info.means, $),
        "max": $lookup($$.ci_info.'m+s', $)
    }[]
  })
  `);

  canHandle(algorithm: string): boolean {
    return algorithm.toLocaleLowerCase() === ALGO_NAME;
  }

  getTuckeyTable(data: unknown): TableResult | undefined {
    const tableData = AnovaOneWayHandler.tuckeyTransform.evaluate(data);

    if (!tableData) return undefined;

    const tableResult: TableResult = {
      ...tableData,
      tableStyle: TableStyle.DEFAULT,
    } as unknown as TableResult;

    return tableResult;
  }

  getSummaryTable(data: unknown, varname: string): TableResult | undefined {
    const tableSummary: TableResult = {
      name: 'Anova summary',
      tableStyle: TableStyle.DEFAULT,
      headers: ['', 'DF', 'SS', 'MS', 'F ratio', 'P value'].map((name) => ({
        name,
        type: 'string',
      })),
      data: [
        [
          varname,
          data['anova_table']['df_explained'],
          data['anova_table']['ss_explained'],
          data['anova_table']['ms_explained'],
          data['anova_table']['p_value'],
          data['anova_table']['f_stat'],
        ],
        [
          'Residual',
          data['anova_table']['df_residual'],
          data['anova_table']['ss_residual'],
          data['anova_table']['ms_residual'],
          '',
          '',
        ],
      ],
    };

    return tableSummary;
  }

  getMeanPlot(data: any): MeanChartResult {
    return AnovaOneWayHandler.meanPlotTransform.evaluate(data);
  }

  handle(exp: Experiment, data: any, domain: Domain): void {
    if (!data || data.length === 0) return super.handle(exp, data, domain);

    if (!this.canHandle(exp.algorithm.name))
      return super.handle(exp, data, domain);

    const result = data[0];

    const summaryTable = this.getSummaryTable(result, exp.coVariables[0]);
    if (summaryTable) exp.results.push(summaryTable);

    const tuckeyTable = this.getTuckeyTable(result);
    if (tuckeyTable) exp.results.push(tuckeyTable);

    const meanPlot = this.getMeanPlot(result);
    if (meanPlot && meanPlot.pointCIs) exp.results.push(meanPlot);
  }
}
