import * as jsonata from 'jsonata'; // old import style needed due to 'export = jsonata'
import { formatNumber } from '../../../../../common/utils/shared.utils';
import { Domain } from '../../../../models/domain.model';
import { MeanChartResult } from '../../../../models/result/means-chart-result.model';
import { Experiment } from '../../../../models/experiment/experiment.model';
import {
  TableResult,
  TableStyle,
} from '../../../../models/result/table-result.model';
import BaseHandler from '../base.handler';

export default class AnovaOneWayHandler extends BaseHandler {
  public static readonly ALGO_NAME = 'anova_oneway';
  private static readonly tuckeyTransform = jsonata(`
    (
      $format:= "#0.0000";
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
        "data": tuckey_test.[$lookup($$.categories, $.groupA),
                             $lookup($$.categories, $.groupB),
                             $formatNumber($.meanA, $format),
                             $formatNumber($.meanB, $format),
                             $formatNumber($.diff, $format),
                             $formatNumber($.se, $format),
                             $formatNumber($.t_stat, $format),
                             $formatNumber($.p_tuckey, $format)
                            ][]
    })
  `);

  private static readonly meanPlotTransform = jsonata(`
  (
    $cats:= $keys(ci_info.means);
    
    {
    "name": "Mean Plot: " & anova_table.y_label & ' ~ ' & anova_table.x_label,
    "xAxis": {
        "label": anova_table.x_label,
        "categories": $cats.($lookup($$.categories, $))
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

  canHandle(algorithm: string, data: any): boolean {
    return (
      data &&
      data.length !== 0 &&
      data[0]['anova_table'] &&
      algorithm.toLocaleLowerCase() === AnovaOneWayHandler.ALGO_NAME
    );
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
          formatNumber(data['anova_table']['ss_explained']),
          formatNumber(data['anova_table']['ms_explained']),
          formatNumber(data['anova_table']['f_stat']),
          formatNumber(data['anova_table']['p_value']),
        ],
        [
          'Residual',
          data['anova_table']['df_residual'],
          formatNumber(data['anova_table']['ss_residual']),
          formatNumber(data['anova_table']['ms_residual']),
          'N/A',
          'N/A',
        ],
      ],
    };

    return tableSummary;
  }

  getMeanPlot(data: any): MeanChartResult {
    return AnovaOneWayHandler.meanPlotTransform.evaluate(data);
  }

  handle(exp: Experiment, data: any, domain: Domain): void {
    if (!this.canHandle(exp.algorithm.name, data))
      return super.handle(exp, data, domain);

    const result = data[0];

    const varIds = [...exp.variables, ...(exp.coVariables ?? [])];
    const variables = domain.variables.filter((v) => varIds.includes(v.id));

    const [variable, coVariate] = variables;

    if (variable) result.anova_table.y_label = variable.label ?? variable.id;
    if (coVariate) result.anova_table.x_label = coVariate.label ?? coVariate.id;

    if (coVariate && coVariate.enumerations) {
      result.categories = coVariate.enumerations.reduce((p, e) => {
        p[e.value] = e.label ?? e.value;
        return p;
      }, {});
    } else {
      result.categories = result['min_max_per_group']['categories'].reduce(
        (p: { [x: string]: string }, e: string) => {
          p[e] = e;
          return p;
        },
        {},
      );
    }

    const summaryTable = this.getSummaryTable(
      result,
      result.anova_table.x_label,
    );
    if (summaryTable) exp.results.push(summaryTable);

    const tuckeyTable = this.getTuckeyTable(result);
    if (tuckeyTable) exp.results.push(tuckeyTable);

    const meanPlot = this.getMeanPlot(result);
    if (meanPlot && meanPlot.pointCIs) exp.results.push(meanPlot);
  }
}
