import { TableResult } from 'src/engine/models/result/table-result.model';
import { Domain } from '../../../../models/domain.model';
import { Experiment } from '../../../../models/experiment/experiment.model';
import {
  GroupResult,
  GroupsResult,
} from '../../../../models/result/groups-result.model';
import { ResultExperiment } from '../../interfaces/experiment/result-experiment.interface';
import BaseHandler from '../base.handler';

interface Stat {
  dataset: string;
  variable: string;
  data: Record<string, string> | null;
}

export default class DescriptiveHandler extends BaseHandler {
  public static readonly ALGO_NAME = 'descriptive_stats';

  static lookup(variable: string, domain: Domain) {
    return (
      domain.variables.find((lookupVariable) => lookupVariable.id === variable)
        ?.label || variable
    );
  }

  static readonly descriptiveToTable = (
    stats: Stat[],
    domain: Domain,
  ): TableResult[] => {
    const datasets: string[] = Array.from(new Set(stats.map((d) => d.dataset)));
    const variables: string[] = Array.from(
      new Set(stats.map((d) => d.variable)),
    );

    const columns = (variable) => {
      const stat = stats.filter((s) => s.variable === variable);
      const data = (key) =>
        stat.map((d) =>
          d.data === null ? 'No Enough Data' : d.data[key] || '',
        );
      const modalities = Array.from(
        new Set(data('counts').flatMap((c) => Object.keys(c))),
      );
      const notEnoughData = stat.map((d) => d.data).includes(null);

      return (
        (notEnoughData && [[variable, ...data('num_total')]]) || [
          [this.lookup(variable, domain), ...data('num_total')],
          ['Datapoints', ...data('num_dtps')],
          ['NA', ...data('num_na')],
          ...(modalities.length > 0
            ? modalities.map((m) => [
              m,
              ...stat.map((d) => d.data.counts[m] || ''),
            ])
            : [
              ['SE', ...data('std')],
              ['mean', ...data('mean')],
              ['min', ...data('num_dtps')],
              ['Q1', ...data('q1')],
              ['Q2', ...data('q2')],
              ['Q3', ...data('q3')],
              ['max', ...data('max')],
            ]),
        ]
      );
    };

    return variables.map((variable) => ({
      headers: [
        { name: '', type: 'string' },
        ...datasets.map((d) => ({ name: d, type: 'string ' })),
      ],
      data: columns(variable),
      name: '',
      tableStyle: 1,
    }));
  };

  descriptiveDataToTableResult2(
    data: ResultExperiment,
    domain: Domain,
  ): GroupsResult {
    const result = new GroupsResult();

    result.groups = [
      new GroupResult({
        name: 'Variables',
        description: 'Descriptive statistics for the variables of interest.',
        results: DescriptiveHandler.descriptiveToTable(
          data['variable_based'],
          domain,
        ),
      }),
    ];

    result.groups.push(
      new GroupResult({
        name: 'Model',
        description:
          'Intersection table for the variables of interest as it appears in the experiment.',
        results: DescriptiveHandler.descriptiveToTable(
          data['model_based'],
          domain,
        ),
      }),
    );

    return result;
  }

  handle(exp: Experiment, data: unknown, domain?: Domain): void {
    if (exp.algorithm.name.toLowerCase() !== 'descriptive_stats')
      return super.handle(exp, data, domain);

    const inputs = data as ResultExperiment[];

    if (inputs && Array.isArray(inputs)) {
      inputs
        .map((input) => this.descriptiveDataToTableResult2(input, domain))
        .forEach((input) => exp.results.push(input));
    }
  }
}
