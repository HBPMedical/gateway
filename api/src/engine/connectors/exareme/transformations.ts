// This file contains all transformation queries for JSONata
// see : https://docs.jsonata.org/

import * as jsonata from 'jsonata'; // old import style needed because of 'export = jsonata'

export const transientToTable = jsonata(`
( 
  $e := function($x) {(
    ($x != null) ? $x : ''
  )};

  result.data.[
    $.single.*@$p#$i.{
      'groupBy' : 'single',
      'name': $keys(%)[$i],
      'metadatas': $keys(*).{
        'name': $,
        'type': 'string'
      },
      'data' : [
        [$keys(%)[$i], $p.*.($e(num_total))],
        ['Datapoints', $p.*.($e(num_datapoints))],
        ['Nulls', $p.*.($e(num_nulls))],
        ['std', $p.*.data.($e(std))],
        ['max', $p.*.data.($e(max))],
        ['min', $p.*.data.($e(min))],
        ['mean', $p.*.data.($e(mean))]
      ]
    }
  ]
)
`);
