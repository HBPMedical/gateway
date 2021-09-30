// This file contains all transformation queries for JSONata
// see : https://docs.jsonata.org/

import * as jsonata from 'jsonata'; // old import style needed due to 'export = jsonata'

export const transientToTable = jsonata(`
( 
    $e := function($x, $r) {($x != null) ? $x : ($r ? $r : '')};

    $fn := function($o, $prefix) {
        $type($o) = 'object' ? 
        $each($o, function($v, $k) {(
            $type($v) = 'object' ? { $k: $v.count & ' (' & $v.percentage & '%)' } : {
                $k: $v
            }
        )}) ~> $merge()
        : {}
    };

    result.data.[
        $.single.*@$p#$i.(
            $ks := $keys($p.*.data[$type($) = 'object']);
            {
            'groupBy' : 'single',
            'name': $keys(%)[$i],
            'headers': $append("", $keys(*)).{
                'name': $,
                'type': 'string'
            },
            'data' : [
                [$keys(%)[$i], $p.*.($e(num_total))],
                ['Datapoints', $p.*.($e(num_datapoints))],
                ['Nulls', $p.*.($e(num_nulls))],
                $p.*.data.($fn($)) ~> $reduce(function($a, $b) {
                    $map($ks, function($k) {(
                        {
                            $k : [$e($lookup($a,$k), "No data"), $e($lookup($b,$k), "No data")]
                        }
                    )}) ~> $merge()
                }) ~> $each(function($v, $k) {$append($k,$v)})
            ]
        })
    ]
)
`);
