import { Domain } from '../../../../models/domain.model';
import { Experiment } from '../../../../models/experiment/experiment.model';
import {
  TableResult,
  TableStyle,
} from '../../../../models/result/table-result.model';
import { Variable } from '../../../../models/variable.model';
import BaseHandler from '../base.handler';

const NUMBER_PRECISION = 4;

export default class AnovaTwoWayHandler extends BaseHandler {
  public static readonly ALGO_NAME = 'anova_twoway';

  private canHandle(algorithm: string, data: any): boolean {
    return (
      algorithm === AnovaTwoWayHandler.ALGO_NAME &&
      !!data &&
      !!data[0] &&
      !!data[0]['terms']
    );
  }

  getSummaryTable(data: any, variables: Variable[]): TableResult | undefined {
    return {
      name: 'Anova two way Summary',
      tableStyle: TableStyle.DEFAULT,
      headers: ['', 'DF', 'Sum Sq', 'F value', 'Pr(>F)'].map((name) => ({
        name,
        type: 'string',
      })),
      data: [
        data['terms'].map((term: string, index: number) => [
          variables.find((variable) => variable.id == term)?.label ?? term,
          data['df'][index]?.toPrecision(NUMBER_PRECISION) ?? '',
          data['sum_sq'][index]?.toPrecision(NUMBER_PRECISION) ?? '',
          data['f_stat'][index]?.toPrecision(NUMBER_PRECISION) ?? '',
          data['f_pvalue'][index]?.toPrecision(NUMBER_PRECISION) ?? '',
        ]),
      ],
    };
  }

  handle(exp: Experiment, data: any, domain: Domain): void {
    if (!this.canHandle(exp.algorithm.name, data))
      return super.handle(exp, data, domain);

    const result = data[0];

    const varIds = [...exp.variables, ...(exp.coVariables ?? [])];
    const variables = domain.variables.filter((v) => varIds.includes(v.id));

    const summaryTable = this.getSummaryTable(result, variables);

    if (summaryTable) exp.results.push(summaryTable);
  }
}
