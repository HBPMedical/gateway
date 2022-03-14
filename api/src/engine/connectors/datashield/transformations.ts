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
      "id": rootGroup.id[0],
      "label": rootGroup.label[0],
      "groups": rootGroup.groups
  },
  "groups": groups.{
      "id": $.id[0],
      "label": $.label[0],
      "variables": $.variables,
      "groups": $.groups
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
  $nbBreaks := $count(global.breaks);
  $params := ["counts"];

  {
  "chart": {
    "type": 'column'
  },
  "legend": {
    "enabled": false
  },
  "series": global.$each(function ($v, $k) {
      $k in $params ? {
          "name": $k,
          "data": $v 
      } : undefined
  })[],
  "title": {
    "text": title ? title : ''
  },
  "tooltip": {
    "enabled": true
  },
  "xAxis": {
    "categories": global.breaks#$i[$i < $nbBreaks-1].[$ & ' - ' & %.*[$i+1]]
  },
  "yAxis": {
    "min": 0,
    "minRange": 0.1,
    "allowDecimals": true
  }
})
  `);

export const transformToTable = jsonata(`
(
  $params := ["title"];
  {
  "name": "Descriptive Statistics",
  "headers": $append(title, ['5%','10%','25%','50%','75%','90%','95%','Mean']).{
      "name": $,
      "type": "string"
  },
  "data": $.$each(function($v, $k) {
         $not($k in $params) ? $append($k,$v.*) : undefined
      })
})
`);
