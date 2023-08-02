// This file contains all transformation queries for JSONata
// see : https://docs.jsonata.org/

import * as jsonata from 'jsonata'; // old import style needed due to 'export = jsonata'

export const transformToExperiment = jsonata(`
( 
    $params := ["y", "pathology", "dataset", "filter", "x", "formula"];
    $toArray := function($x) { $type($x) = 'array' ? $x : [$x]};
    $convDate := function($v) { $type($v) = 'string' ? $v : $fromMillis($v) };
    $rp := function($v) {$replace($v, /(\\+|\\*|-)/, ',')};
    $strSafe := function($v) { $type($v) = 'string' ? $v : "" };
    $formula := $eval(algorithm.parameters[name = "formula"].value);
    $checkVal:= function($val) { $val ? $val : undefined};

    ($ ~> | algorithm.parameters | {"name": name ? name : label } |){
        "name": name,
        "id": uuid,
        "author": createdBy,
        "viewed": viewed,
        "status": status,
        "createdAt": $convDate(created),
        "finishedAt": $convDate(finished),
        "shared": shared,
        "updateAt": $convDate(updated),
        "domain": algorithm.parameters[name = "pathology"][0].value,
        "datasets": $split(algorithm.parameters[name = "dataset"][0].value, ','),
        "variables": $split($rp(algorithm.parameters[name = "y"][0].value), ','),
        "coVariables": $toArray($split($rp(algorithm.parameters[name = "x"][0].value), ',')),
        "filterVariables": (algorithm.parameters[name = "filter"][0].value ~> $strSafe() ~> $match(/\\"id\\":\\"(\w*)\\"/)).groups,
        "filter": algorithm.parameters[name = "filter"][0].value,
        "formula": {
            "transformations": $formula.single.{
                "id": var_name,
                "operation": unary_operation
            }[],
            "interactions" : $formula.interactions.[var1, var2][]
        },
        "algorithm": {
            "name": algorithm.name,
            "parameters" : $toArray(
                    algorithm.parameters[$not(name in $params)].({
                        "name": name,
                        "label": label,
                        "value": value
                    })
                ),
            "preprocessing": $toArray(algorithm.preprocessing[$checkVal(name)]).({
                "name": name,
                "desc": label,
                "label": value,
                "parameters": $toArray(parameters).({
                    "name": name,
                    "label": label,
                    "value": value
                })
            })[]
        }
    }
)
`);

export const dataROCToLineResult = jsonata(`
({
    "name": data.title.text,
    "xAxis": {
        "label": data.xAxis.title.text
    },
    "yAxis": {
        "label": data.yAxis.title.text
    },
    "lines": [
        {
            "label": "ROC curve",
            "x": data.series.data.$[0],
            "y": data.series.data.$[1],
            "type": 0
        }
    ],
    "hasBisector": true
})
`);

export const dataToHeatmap = jsonata(`
(
    {
        "name": data.title.text,
        "xAxis": {
            "categories": data.xAxis.categories,
            "label": data.xAxis.label
        },
        "yAxis": {
            "categories": data.yAxis.categories,
            "label": data.yAxis.label
        },
        "matrix": $toMat(data.series.data)
    }
)
`);

export const dataToUser = jsonata(`
$ ~> |$|{'id': subjectId}, ['subjectId']|
`);

dataToHeatmap.registerFunction(
  'toMat',
  (a) => {
    const matrix = [];

    a.forEach((elem: { y: number; x: number; value: number }) => {
      matrix[elem.y] = matrix[elem.y] ?? [];
      matrix[elem.y][elem.x] = elem.value;
    });

    return matrix.reverse();
  },
  '<a<o>:a<a<n>>',
);
