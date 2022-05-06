import * as jsonata from 'jsonata';

const transformToAlgorithms = jsonata(`
(
    $dict:={
        'integer': 'NumberParameter',
        'real': 'NumberParameter'
    };
    $checkVal:= function($val) { $val ? $val : undefined};
    $includes:= ['ANOVA_ONEWAY','ANOVA','LINEAR_REGRESSION',
    'LOGISTIC_REGRESSION','TTEST_INDEPENDENT','TTEST_PAIRED',
    'PEARSON_CORRELATION','ID3','KMEANS','NAIVE_BAYES',
    'TTEST_ONESAMPLE','PCA','CALIBRATION_BELT','CART',
    'KAPLAN_MEIER','THREE_C'];
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
           "isRequired": $boolean($checkVal($v.valueNotBlank)),
           "hasMultiple": $boolean($checkVal($v.valueMultiple)),
           "allowedTypes": $append([], $truthy($v.columnValuesIsCategorical) ? 'nominal' : $map(($checkVal($v.columnValuesSQLType) ~> $split(',')), $trim))
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
       "parameters": parameters[type='other'].{
           "__typename": $lookup($dict, valueType),
           "id": name,
           "label": label,
           "hint":  $checkVal(desc),
           "isRequired": $boolean(valueNotBlank),
           "hasMultiple": $boolean(valueMultiple),
           "min": $checkVal(valueMin),
           "max": $checkVal(valueMax),
           "allowedValues":  $checkVal(valueEnumerations).{'id':$, 'label': $}[],
           "linkedTo": (name in $linkedVars) ? "VARIABLE" : ((name in $linkedCoVars) ? "COVARIABLE" : undefined)
       }[]
   }[]
)
`);

export default transformToAlgorithms;
