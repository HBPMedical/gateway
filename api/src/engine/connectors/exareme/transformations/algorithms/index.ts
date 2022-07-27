import * as jsonata from 'jsonata';

const transformToAlgorithms = jsonata(`
(
    $dict:={
        'integer': 'NumberParameter',
        'real': 'NumberParameter'
    };
    $checkVal:= function($val) { $val ? $val : undefined};
    $excludedParams:= ['centers', 'formula'];
    $includes:= ['ANOVA_ONEWAY','ANOVA','LINEAR_REGRESSION',
    'LOGISTIC_REGRESSION','TTEST_INDEPENDENT','TTEST_PAIRED',
    'PEARSON','ID3','KMEANS','NAIVE_BAYES',
    'TTEST_ONESAMPLE','PCA','CALIBRATION_BELT','CART',
    'KAPLAN_MEIER','THREE_C', 'ONE_WAY_ANOVA', 'PEARSON', 'LINEAR_REGRESSION_CV'];
    $linkedVars:= ['positive_level', 'negative_level', 'outcome_neg', 'outcome_pos'];
    $linkedCoVars:= ['referencevalues', 'xlevels'];
    $truthy:= function($val) {(
        $v:= $lowercase($val);
        $v='true' ? true : ($v='false'? false : undefined)
    )};
    $extract:= function($v) {
        $v?
        {
           "hint": $v.desc,
           "isRequired": $truthy($checkVal($v.valueNotBlank)),
           "hasMultiple": $truthy($checkVal($v.valueMultiple)),
           "allowedTypes": $v.columnValuesIsCategorical = '' and $v.columnValuesSQLType = '' ?
           undefined : $append($v.columnValuesIsCategorical = '' ?
           ['nominal'] : [], $truthy($v.columnValuesIsCategorical) ? 'nominal' : $map(($checkVal($v.columnValuesSQLType) ~> $split(',')), $trim))
       } : undefined
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
       }[]
   }[]
)
`);

export default transformToAlgorithms;
