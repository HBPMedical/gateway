// This file contains all transformation queries for JSONata
// see : https://docs.jsonata.org/

import * as jsonata from 'jsonata';

export const transformToDomains = jsonata(`
{
    "id": "sophia",
    "datasets": datasets.{
        "id": $.id[0],
        "label": $.label[0]
    },
    "rootGroup": {
        "id": "rootGroup",
        "label": "Root group",
        "groups": groups.id
    },
    "groups": groups.{
        "id": $.id[0],
        "label": $.label[0],
        "variables": $.variables
    },
    "variables": $distinct(groups.variables).{
        "id": $,
        "label": $trim($replace($ & '', '.', ' ')),
        "type": "Number"
    }
}
`);

export const transformToHisto = jsonata(`
(
    $nbBreaks := $count(breaks);

    {
    "chart": {
      "type": 'column'
    },
    "legend": {
      "enabled": false
    },
    "series": [
      {
        "data": counts,
        "dataLabels": {
          "enabled": true
        }
      }
    ],
    "title": {
      "text": title ? title : ''
    },
    "tooltip": {
      "enabled": true
    },
    "xAxis": {
      "categories": breaks#$i[$i < $nbBreaks-1].[$ & ' - ' & %.*[$i+1]]
    },
    "yAxis": {
      "min": 0,
      "minRange": 0.1,
      "allowDecimals": true
    }
})
  `);

export const transformToTable = jsonata(`
{
    "name": "Descriptive Statistics",
    "headers": $append(title, ['5%','10%','25%','50%','75%','90%','95%','Mean']).{
        "name": $,
        "type": "string"
    },
    "data": $.message.$each(function($v, $k) {
           $append($k,$v)
        })
}
`);

/*export const transformToTable = jsonata(`
(
    $params := ["xname", "equidist", "breaks"];
    $concat := function($i, $j) {
        $append($i, $j)
    };

    {
        "name": "test",
        "headers": $append('', $.*[0].breaks).{
            "name": $,
            "type": "string"
        },
        "data": $.$each(function($v, $k) {
           [[$k],$v.$each(function($v, $k) {$not($k in $params) ? $append($k, $v) : undefined})]
        }) ~> $reduce($concat, [])
    }
)
`);*/

/* export const transformToTable = jsonata(`
(
    $params := ["xname", "equidist", "breaks"];

    $.$each(function($v, $k) {
        {
            "name": $k,
            "headers": $v.breaks,
            "data": $v.$each(function($v, $k) {$not($k in $params) ? $append($k, $v) : undefined})
        }
    })
)
`); */
