import { Algorithm } from 'src/engine/models/experiment/algorithm.model';
import { NominalParameter } from 'src/engine/models/experiment/algorithm/nominal-parameter.model';
import transformToAlgorithms from '.';

describe('Algorithms', () => {
  describe('when data is correct (Dummy Kaplan)', () => {
    const data = [
      {
        name: 'KAPLAN_MEIER',
        desc: 'Kaplan-Meier Estimator for the Survival Function',
        label: 'Kaplan-Meier Estimator',
        type: 'python_local_global',
        parameters: [
          {
            name: 'y',
            desc: 'A single categorical variable whose values describe a binary event.',
            label: 'y',
            type: 'column',
            columnValuesSQLType: 'integer, text',
            columnValuesIsCategorical: 'true',
            value: 'alzheimerbroadcategory',
            defaultValue: null,
            valueType: 'string',
            valueNotBlank: 'false',
            valueMultiple: 'false',
            valueMin: null,
            valueMax: null,
            valueEnumerations: null,
          },
          {
            name: 'x',
            desc: 'A single categorical variable based on which patients are grouped.',
            label: 'x',
            type: 'column',
            columnValuesSQLType: 'integer, text',
            columnValuesIsCategorical: 'false',
            value: 'apoe4',
            defaultValue: null,
            valueType: 'string',
            valueNotBlank: 'false',
            valueMultiple: 'false',
            valueMin: null,
            valueMax: null,
            valueEnumerations: null,
          },
          {
            name: 'pathology',
            desc: 'The name of the pathology that the dataset belongs to.',
            label: 'pathology',
            type: 'pathology',
            columnValuesSQLType: null,
            columnValuesIsCategorical: null,
            value: 'dementia_longitudinal',
            defaultValue: null,
            valueType: 'string',
            valueNotBlank: 'true',
            valueMultiple: 'false',
            valueMin: null,
            valueMax: null,
            valueEnumerations: null,
          },
          {
            name: 'dataset',
            desc: '',
            label: 'dataset',
            type: 'dataset',
            columnValuesSQLType: null,
            columnValuesIsCategorical: null,
            value: 'alzheimer_fake_cohort',
            defaultValue: null,
            valueType: 'string',
            valueNotBlank: 'true',
            valueMultiple: 'true',
            valueMin: null,
            valueMax: null,
            valueEnumerations: null,
          },
          {
            name: 'filter',
            desc: '',
            label: 'filter',
            type: 'filter',
            columnValuesSQLType: null,
            columnValuesIsCategorical: null,
            value: '',
            defaultValue: null,
            valueType: 'string',
            valueNotBlank: 'false',
            valueMultiple: 'true',
            valueMin: null,
            valueMax: null,
            valueEnumerations: null,
          },
          {
            name: 'outcome_pos',
            desc: '',
            label: 'Positive outcome',
            type: 'other',
            columnValuesSQLType: null,
            columnValuesIsCategorical: null,
            value: 'AD',
            defaultValue: null,
            valueType: 'string',
            valueNotBlank: 'true',
            valueMultiple: 'false',
            valueMin: null,
            valueMax: null,
            valueEnumerations: null,
          },
          {
            name: 'outcome_neg',
            desc: '',
            label: 'Negative outcome',
            type: 'other',
            columnValuesSQLType: null,
            columnValuesIsCategorical: null,
            value: 'MCI',
            defaultValue: null,
            valueType: 'string',
            valueNotBlank: 'true',
            valueMultiple: 'false',
            valueMin: null,
            valueMax: null,
            valueEnumerations: null,
          },
          {
            name: 'test',
            desc: '',
            label: 'Total duration of experiment in days',
            type: 'other',
            columnValuesSQLType: null,
            columnValuesIsCategorical: null,
            value: '1100',
            defaultValue: null,
            valueType: 'real',
            valueNotBlank: 'true',
            valueMultiple: 'false',
            valueMin: null,
            valueMax: null,
            valueEnumerations: ['test', 'test2'],
          },
          {
            name: 'total_duration',
            desc: '',
            label: 'Total duration of experiment in days',
            type: 'other',
            columnValuesSQLType: null,
            columnValuesIsCategorical: null,
            value: '1100',
            defaultValue: null,
            valueType: 'real',
            valueNotBlank: 'true',
            valueMultiple: 'false',
            valueMin: null,
            valueMax: null,
            valueEnumerations: null,
          },
        ],
      },
    ];

    const algorithms: Algorithm[] = transformToAlgorithms.evaluate(data);
    const kaplan = algorithms[0];

    it('should produce one algorithm', () => {
      expect(algorithms.length).toEqual(1);
    });

    it('should produce two algorithms', () => {
      const algorithms: Algorithm[] = transformToAlgorithms.evaluate([
        ...data,
        ...data,
      ]);
      expect(algorithms.length).toEqual(2);
    });

    it('variable should be nominal', () => {
      expect(kaplan.variable).not.toBeUndefined();
      expect(kaplan.variable?.allowedTypes).toStrictEqual(['nominal']);
    });

    it('covariable should be integer or text', () => {
      expect(kaplan.coVariable).not.toBeUndefined();
      expect(kaplan.coVariable?.allowedTypes).toStrictEqual([
        'integer',
        'text',
      ]);
    });

    it('should have 4 parameters', () => {
      expect(kaplan.parameters.length).toBe(4);
    });

    it('nominal parameters should have values allowed', () => {
      const nominalParam = kaplan.parameters.find(
        (p) => p.id === 'test',
      ) as NominalParameter;

      expect(JSON.stringify(nominalParam.allowedValues)).toEqual(
        JSON.stringify([
          {
            id: 'test',
            label: 'test',
          },
          {
            id: 'test2',
            label: 'test2',
          },
        ]),
      );
    });

    it('should have at least one linkedTo parameter', () => {
      expect(kaplan.parameters.some((param) => param['linkedTo']));
    });
  });

  describe('when data does not contains any parameters', () => {
    const data = [
      {
        name: 'KAPLAN_MEIER',
        desc: 'Kaplan-Meier Estimator for the Survival Function',
        label: 'Kaplan-Meier Estimator',
        type: 'python_local_global',
        parameters: [
          {
            name: 'y',
            desc: 'A single categorical variable whose values describe a binary event.',
            label: 'y',
            type: 'column',
            columnValuesSQLType: 'integer, text',
            columnValuesIsCategorical: 'true',
            value: 'alzheimerbroadcategory',
            defaultValue: null,
            valueType: 'string',
            valueNotBlank: 'false',
            valueMultiple: 'false',
            valueMin: null,
            valueMax: null,
            valueEnumerations: null,
          },
          {
            name: 'x',
            desc: 'A single categorical variable based on which patients are grouped.',
            label: 'x',
            type: 'column',
            columnValuesSQLType: 'integer, text',
            columnValuesIsCategorical: 'false',
            value: 'apoe4',
            defaultValue: null,
            valueType: 'string',
            valueNotBlank: 'false',
            valueMultiple: 'false',
            valueMin: null,
            valueMax: null,
            valueEnumerations: null,
          },
        ],
      },
    ];

    const algorithms: Algorithm[] = transformToAlgorithms.evaluate(data);
    const kaplan = algorithms[0];

    it('Algo parameters should be undefined', () => {
      expect(kaplan.parameters).toBeUndefined;
    });
  });

  describe('when data is empty or undefined', () => {
    it('should be undefined when data is undefined', () => {
      const data = undefined;
      const algorithms: Algorithm[] = transformToAlgorithms.evaluate(data);

      expect(algorithms).toBeUndefined();
    });

    it('should be undefined when data is empty', () => {
      const data = `
      {
        dummy:
      }`;

      const algorithms: Algorithm[] = transformToAlgorithms.evaluate(data);

      expect(algorithms).toBeUndefined();
    });
  });
});
