import * as jsonata from 'jsonata';

const transformToAlgorithms = jsonata(`
(
    $dict:={
        'integer': 'NumberParameter',
        'real': 'NumberParameter'
    };
    $dictTypes:= {
        'int': 'integer'
    };
    $checkVal:= function($val) { $val ? $val : undefined};
    $getOrDefault:= function($v, $d) { $v ? $v : $d };
    $excludedParams:= ['centers', 'formula'];
    $includes:= ['anova_oneway','anova','linear_regression',
    'logistic_regression', 'logistic_regression_cv','ttest_independant','ttest_paired',
    'pearson','id3','kmeans','naive_bayes',
    'ttest_onesample','pca','calibration_belt','cart',
    'kaplan_meier','three_c', 'one_way_anova', 'pearson_correlation',
    'linear_regression_cv', 'paired_ttest', 'naive_bayes_gaussian_cv', 'naive_bayes_categorical_cv'];
    $linkedVars:= ['positive_class', 'positive_level', 'negative_level', 'outcome_neg', 'outcome_pos'];
    $linkedCoVars:= ['referencevalues', 'xlevels', 'groupA', 'groupB', 'visit1', 'visit2'];
    $truthy:= function($val) {(
        $v:= $lowercase($val);
        $v='true' ? true : ($v='false'? false : undefined)
    )};
    $extract:= function($v) {
        (
            $categorical:=$v.columnValuesIsCategorical;
            $varTypes:= ($split($getOrDefault($v.columnValuesSQLType, ''), ',')[]) ~> $map($trim) ~> $map(function($value) { $getOrDefault($lookup($dictTypes, $value), $value) });
            $v?
            {
                "hint": $v.desc,
                "isRequired": $truthy($checkVal($v.valueNotBlank)),
                "hasMultiple": $truthy($checkVal($v.valueMultiple)),
                "allowedTypes": $categorical = '' and $v.columnValuesSQLType = '' ? undefined : $append($categorical = '' ? ['nominal'] : [], $truthy($categorical) ? 'nominal' : $varTypes)
            } : undefined
        )
    };

   $[name in $includes].{
       "id": name,
       "label": $checkVal(label),
       "type": type,
       "description": $checkVal(desc),
       "variable": parameters[(type='column' or type='formula') and name='y'] ~> $extract,
       "coVariable": parameters[(type='column' or type='formula') and name='x'] ~> $extract,
       "hasFormula": $boolean(parameters[(type='formula_description')]),
       "parameters": parameters[type='other' and $not(name in $excludedParams)].{
           "__typename": $lookup($dict, (valueType ? valueType : 'null')),
           "name": name,
           "label": label,
           "hint":  $checkVal(desc),
           "defaultValue": (name in $linkedCoVars) ? "[]" : (defaultValue ? defaultValue : value),
           "isRequired": $truthy(valueNotBlank),
           "hasMultiple": $truthy(valueMultiple),
           "isReal": valueType = 'real' ? true : undefined,
           "min": $checkVal(valueMin),
           "max": $checkVal(valueMax),
           "allowedValues":  $checkVal(valueEnumerations).{'value':$, 'label': $}[],
           "linkedTo": (name in $linkedVars) ? "VARIABLE" : ((name in $linkedCoVars) ? "COVARIABLE" : undefined)
       }[],
       "preprocessing": preprocessing[$checkVal(name)].{
            "name": name,
            "label": label,
            "hint": $checkVal(desc),
            "parameters": parameters.{
                "__typename": $lookup($dict, (valueType ? valueType : 'null')),
                "name": name,
                "label": label,
                "hint":  $checkVal(desc),
                "isRequired": $truthy(valueNotBlank),
                "hasMultiple": $truthy(valueMultiple),
                "allowedValues": (name="strategies") ? ['first', 'second', 'diff'].{'value':$, 'label': $}[] : $checkVal(valueEnumerations).{'value':$, 'label': $}[]
           }[]      
       }[]
   }[]
)
`);

export default transformToAlgorithms;
