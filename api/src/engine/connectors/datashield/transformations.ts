// This file contains all transformation queries for JSONata
// see : https://docs.jsonata.org/

import * as jsonata from 'jsonata';
import { Domain } from 'src/engine/models/domain.model';
import { Group } from 'src/engine/models/group.model';

export const transformToDomain = jsonata(`
{
  "id": "sophia",
  "label": "Sophia",
  "datasets": datasets.{
      "id": $.id[0],
      "label": $.label[0]
  },
  "rootGroup": {
      "id": "root",
      "label": "Sophia",
      "groups": $append(rootGroup.groups, $keys($.groups.variables))
  },
  "groups": datasets.{
      "id": $.id[0],
      "label": $.label[0],
      "groups": [],
      "datasets": $.id[0][]
    }[],
  "variables": $distinct(groups.variables.($type($) = 'object' ? $.* : $)).{
      "id": $,
      "label": $trim($replace($ & '', '.', ' '))
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

export const transformToUser = jsonata(`
$ ~> |$|{'id': subjectId}, ['subjectId']|
`);

export type dsGroup = {
  id: string[];
  label: string[];
  variables: Record<string, string[]> | string[];
  groups?: string[];
};

export const dataToGroups = (dsDomain: Domain, groups: dsGroup[]) => {
  groups.forEach((g) => {
    if (Array.isArray(g.variables)) {
      dsDomain.groups.push({
        id: g.id[0],
        label: g.label[0],
        variables: g.variables,
      });
      return;
    }

    if (dsDomain.rootGroup.groups.includes(g.id[0])) {
      dsDomain.rootGroup.groups = dsDomain.rootGroup.groups.filter(
        (gId) => gId !== g.id[0],
      );
    }

    return Object.entries(g.variables).map(([key, val]) => {
      const id = `${g.id}-${key}`;
      dsDomain.groups.find((g) => g.id === key).groups.push(id);
      const group: Group = {
        id,
        variables: val,
        groups: g['groups'] ? g['groups'].map((g) => `${g}-${key}`) : undefined,
        label: g.label[0],
      };
      dsDomain.groups.push(group);
    });
  });
};
