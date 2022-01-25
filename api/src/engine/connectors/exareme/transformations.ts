// This file contains all transformation queries for JSONata
// see : https://docs.jsonata.org/

import * as jsonata from 'jsonata'; // old import style needed due to 'export = jsonata'

export const transformToAlgorithms = jsonata(`
(
    $params := ["y", "pathology", "dataset", "filter", "x"];

    $toArray := function($x) { $type($x) = 'array' ? $x : [$x]};

    *.{
    'id': name,
    'label': label,
    'description': desc,
    'parameters': $toArray(parameters[$not(name in $params)].{
        'id': name,
        'description': desc,
        'label': label,
        'type': valueType,
        'defaultValue': defaultValue,
        'isMultiple': $boolean(valueMultiple),
        'isRequired': $boolean(valueNotBlank),
        'min': valueMin,
        'max': valueMax
    })
}
)
`);

export const transformToExperiment = jsonata(`
( 
    $params := ["y", "pathology", "dataset", "filter", "x"];
    $toArray := function($x) { $type($x) = 'array' ? $x : [$x]};
    $convDate := function($v) { $type($v) = 'string' ? $toMillis($v) : $v };
    $rp := function($v) {$replace($v, /(\\+|\\*|-)/, ',')};

    {
        "name": name,
        "id": uuid,
        "author": createdBy,
        "viewed": viewed,
        "status": status,
        "createdAt": $convDate(created),
        "finishedAt": $convDate(finished),
        "shared": shared,
        "updateAt": $convDate(updated),
        "domain": algorithm.parameters[name = "pathology"].value,
        "variables": $split($rp(algorithm.parameters[name = "y"].value), ','),
        "coVariables": $toArray($split($rp(algorithm.parameters[name = "x"].value), ',')),
        "filter": algorithm.parameters[name = "filter"].value,
        "datasets": $split(algorithm.parameters[name = "dataset"].value, ','),
        "algorithm": {
            "id": algorithm.name,
            "parameters" : $toArray(
                    algorithm.parameters[$not(name in $params)].({
                        "id": name,
                        "label": label,
                        "value": value
                    })
                )
        }
    }
)
`);

const headerDescriptivie = `
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

export const descriptiveModelToTables = jsonata(`
(   
    ${headerDescriptivie}
    
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

export const descriptiveSingleToTables = jsonata(`
( 
    ${headerDescriptivie}

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
    ]
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

dataToHeatmap.registerFunction(
  'toMat',
  (a) => {
    const matrix = [];

    a.forEach(
      (elem: { y: number | number; x: number | number; value: number }) => {
        matrix[elem.y] = matrix[elem.y] ?? [];
        matrix[elem.y][elem.x] = elem.value;
      },
    );

    return matrix;
  },
  '<a<o>:a<a<n>>',
);
