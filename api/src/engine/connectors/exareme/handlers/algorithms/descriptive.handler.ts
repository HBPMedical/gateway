import * as jsonata from 'jsonata'; // old import style needed due to 'export = jsonata'
import { Experiment } from '../../../../models/experiment/experiment.model';
import {
  GroupResult,
  GroupsResult,
} from '../../../../models/result/groups-result.model';
import { ResultExperiment } from '../../interfaces/experiment/result-experiment.interface';
import BaseHandler from '../base.handler';

export default class DescriptiveHandler extends BaseHandler {
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

  descriptiveDataToTableResult(data: ResultExperiment): GroupsResult {
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

  handle(exp: Experiment, data: unknown): void {
    let req = data;

    if (exp.algorithm.id.toLowerCase() === 'descriptive_stats') {
      const inputs = data as ResultExperiment[];

      if (inputs && Array.isArray(inputs)) {
        inputs
          .filter((input) => input.type === 'application/json')
          .map((input) => this.descriptiveDataToTableResult(input))
          .forEach((input) => exp.results.push(input));

        req = JSON.stringify(
          inputs.filter((input) => input.type !== 'application/json'),
        );
      }
    }

    this.next?.handle(exp, req);
  }
}
