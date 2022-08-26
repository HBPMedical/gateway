// This file contains all transformation queries for JSONata
// see : https://docs.jsonata.org/

import * as jsonata from 'jsonata';
import { Domain } from '../../../engine/models/domain.model';
import { Group } from '../../../engine/models/group.model';

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
  "variables": variables.(
    $merge([$, {'label': $.label ? $label : $trim($replace($.id, '.', ' '))}])
  )
}
`);

export const transfoToHistoNominal = jsonata(`
(
  {
  "chart": {
    "type": 'column'
  },
  "legend": {
    "enabled": false
  },
  "series": [{
      "name": "Count",
      "data": global.*   
  }],
  "title": {
    "text": title ? title : ''
  },
  "tooltip": {
    "enabled": true
  },
  "xAxis": {
    "categories": $keys(global).(
      $param := $lookup($$.lookup, $);
      $param ? $param : $
    )
  },
  "yAxis": {
    "min": 0,
    "minRange": 0.1,
    "allowDecimals": true
  }
})`);

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
         $not($k in $params) ? $append($k,$v) : undefined
      })[]
})
`);

export const transformToTableNominal = jsonata(`
(
  $params := ["title"];
  {
  "name": "Descriptive Statistics",
  "headers": $append(title, $keys($.*)).{
      "name": $,
      "type": "string"
  },
  "data": $.$each(function($v, $k) {
         $not($k in $params) ? $append($k,$v.*) : undefined
      })[]
})
`);

export const transformToUser = jsonata(`
$ ~> |$|{'id': subjectId}, ['subjectId']|
`);

export type dsGroup = {
  id: string;
  label: string;
  variables: Record<string, string[]> | string[];
  groups?: string[];
};

export const dataToGroups = (dsDomain: Domain, groups: dsGroup[]) => {
  groups.forEach((group) => {
    // Check if variables contains sub db split
    if (Array.isArray(group.variables)) {
      // Global group (exist in every cohort)
      group.variables = dsDomain.datasets.reduce((prev, db) => {
        prev[db.id] = group.variables;
        return prev;
      }, {});
    }

    let isRootGroup = false;

    // remove group if it's in the root
    if (dsDomain.rootGroup.groups.includes(group.id)) {
      isRootGroup = true;
      dsDomain.rootGroup.groups = dsDomain.rootGroup.groups.filter(
        (gId) => gId !== group.id,
      );
    }

    return Object.entries(group.variables).map(([db, variables]) => {
      const id = `${group.id}-${db}`;

      // push group into root db group
      if (isRootGroup)
        dsDomain.groups.find((g2) => g2.id === db).groups.push(id);

      const newGroup: Group = {
        id,
        variables,
        groups: group['groups']
          ? group['groups'].map((g2) => `${g2}-${db}`)
          : undefined,
        label: `${group.label} (${db})`,
      };

      dsDomain.groups.push(newGroup);
    });
  });
};
