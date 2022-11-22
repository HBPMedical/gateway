import * as jsonata from 'jsonata'; // old import style needed due to 'export = jsonata'
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
  public static readonly ALGO_NAME = 'DESCRIPTIVE_STATS';

  private static readonly headerDescriptive = `
$fnum := function($x) { $type($x) = 'number' ? $round($number($x),3) : $x };

$e := function($x, $r) {($x != null) ? $fnum($x) : ($r ? $r : '')};

$fn := function($o, $prefix) {
    $type($o) = 'object' ? 
    $each($o, function($v, $k) {(
        $type($v) = 'object' ? { $k: $v.count & ' (' & $v.percentage & '%)' } : {
            $k: $v
        }
    )}) ~> $merge()
    : {}
};`;

  static readonly descriptiveModelToTables = jsonata(`
(   
    ${this.headerDescriptive}
    
    $vars := $count($keys(data.model.*.data))-1;
    $varNames := $keys(data.model.*.data);
    $model := data.model;

    [[0..$vars].(
        $i := $;
        $varName := $varNames[$i];
        $ks := $keys($model.*.data.*[$i][$type($) = 'object']);
        {
            'name': $varName,
            'tableStyle': 1,
            'headers': $append("", $keys($$.data.model)).{
                'name': $,
                'type': 'string'
            },
            'data': [
                [$varName, $model.*.($e(num_total))],
                ['Datapoints', $model.*.($e(num_datapoints))],
                ['Nulls', $model.*.($e(num_nulls))],
                ($lookup($model.*.data, $varName).($fn($)) ~> $reduce(function($a, $b) {
                    $map($ks, function($k) {(
                        {
                            $k : [$e($lookup($a,$k), "No data"), $e($lookup($b,$k), "No data")]
                        }
                    )}) ~> $merge()
                })).$each(function($v, $k) {$append($k,$v)})[]
            ]
        }
    )]  
)`);

  static readonly descriptiveSingleToTables = jsonata(`
( 
    ${this.headerDescriptive}

    data.[
        $.single.*@$p#$i.(
            $ks := $keys($p.*.data[$type($) = 'object']);
            {
            'name': $keys(%)[$i],
            'tableStyle': 1,
            'headers': $append("", $keys(*)).{
                'name': $,
                'type': 'string'
            },
            'data' : [
                [$keys(%)[$i], $p.*.($e(num_total))],
                ['Datapoints', $p.*.($e(num_datapoints))],
                ['Nulls', $p.*.($e(num_nulls))],
                ($p.*.data.($fn($)) ~> $reduce(function($a, $b) {
                    $map($ks, function($k) {(
                        {
                            $k : [$e($lookup($a,$k), "No data"), $e($lookup($b,$k), "No data")]
                        }
                    )}) ~> $merge()
                })).$each(function($v, $k) {$append($k,$v)})[]
            ]
        })
    ]
)
`);

  descriptiveDataToTableResult1(data: ResultExperiment): GroupsResult {
    const result = new GroupsResult();

    result.groups = [
      new GroupResult({
        name: 'Variables',
        description: 'Descriptive statistics for the variables of interest.',
        results: DescriptiveHandler.descriptiveSingleToTables.evaluate(data),
      }),
    ];

    result.groups.push(
      new GroupResult({
        name: 'Model',
        description:
          'Intersection table for the variables of interest as it appears in the experiment.',
        results: DescriptiveHandler.descriptiveModelToTables.evaluate(data),
      }),
    );

    return result;
  }

  static readonly descriptiveToTable = (stats: Stat[]): TableResult[] => {
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
          [variable, ...data('num_total')],
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

  descriptiveDataToTableResult2(data: ResultExperiment): GroupsResult {
    const result = new GroupsResult();

    result.groups = [
      new GroupResult({
        name: 'Variables',
        description: 'Descriptive statistics for the variables of interest.',
        results: DescriptiveHandler.descriptiveToTable(data['variable_based']),
      }),
    ];

    result.groups.push(
      new GroupResult({
        name: 'Model',
        description:
          'Intersection table for the variables of interest as it appears in the experiment.',
        results: DescriptiveHandler.descriptiveToTable(data['model_based']),
      }),
    );

    return result;
  }

  handle(exp: Experiment, data: unknown, domain?: Domain): void {
    if (exp.algorithm.name.toLowerCase() !== 'descriptive_stats')
      return super.handle(exp, data, domain);

    const inputs = data as ResultExperiment[];

    if (inputs && Array.isArray(inputs)) {
      const exareme1 = inputs.filter(
        (input) => input.type === 'application/json',
      );

      if (exareme1.length > 0)
        exareme1
          .map((input) => this.descriptiveDataToTableResult1(input))
          .forEach((input) => exp.results.push(input));
      else
        inputs
          .map((input) => this.descriptiveDataToTableResult2(input))
          .forEach((input) => exp.results.push(input));
    }
  }
}
