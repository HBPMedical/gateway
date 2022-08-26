import { Experiment } from '../../../../models/experiment/experiment.model';
import { TableResult } from '../../../../models/result/table-result.model';
import { Variable } from '../../../../models/variable.model';
import LinearRegressionHandler from './linear-regression.handler';

const data = {
  Nvalid: 107,
  Nmissing: 506,
  Ntotal: 613,
  'disclosure.risk': [[0]],
  errorMessage: [['No errors']],
  nsubs: 107,
  iter: 3,
  formula:
    'Alanine.aminotransferase..Enzymatic.activity.volume..in.Serum.or.Plasma ~ Urea.nitrogen..Mass.volume..in.Serum.or.Plasma + Albumin..Mass.volume..in.Serum.or.Plasma',
  coefficients: [
    {
      Estimate: -0.2119,
      'Std. Error': 30.8718,
      'z-value': -0.0069,
      'p-value': 0.9945,
      'low0.95CI': -60.7195,
      'high0.95CI': 60.2956,
      _row: '(Intercept)',
    },
    {
      Estimate: 0.1606,
      'Std. Error': 0.4521,
      'z-value': 0.3553,
      'p-value': 0.7224,
      'low0.95CI': -0.7255,
      'high0.95CI': 1.0468,
      _row: 'Urea.nitrogen..Mass.volume..in.Serum.or.Plasma',
    },
    {
      Estimate: 3.7592,
      'Std. Error': 6.8887,
      'z-value': 0.5457,
      'p-value': 0.5853,
      'low0.95CI': -9.7423,
      'high0.95CI': 17.2608,
      _row: 'Albumin..Mass.volume..in.Serum.or.Plasma',
    },
  ],
  dev: 15817.4616,
  df: 104,
  'output.information':
    'SEE TOP OF OUTPUT FOR INFORMATION ON MISSING DATA AND ERROR MESSAGES',
};

const createExperiment = (): Experiment => ({
  id: 'dummy-id',
  name: 'Testing purpose',
  algorithm: {
    name: 'linear-regression',
  },
  datasets: ['sophia.db'],
  domain: 'dementia',
  variables: ['lefthippocampus'],
  coVariables: ['righthippocampus', 'leftamygdala'],
  results: [],
});

const vars: Variable[] = [
  {
    id: 'Alanine.aminotransferase..Enzymatic.activity.volume..in.Serum.or.Plasma',
    label:
      'Alanine aminotransferase Enzymatic activity volume in Serum or Plasma',
  },
  {
    id: 'Urea.nitrogen..Mass.volume..in.Serum.or.Plasma',
    label: 'Urea nitrogen Mass volume in Serum or Plasma',
  },
  {
    id: 'Albumin..Mass.volume..in.Serum.or.Plasma',
    label: 'Albumin Mass volume in Serum or Plasma',
  },
];

describe('linear regression result handler', () => {
  let linearHandler: LinearRegressionHandler;
  let experiment: Experiment;

  beforeEach(() => {
    linearHandler = new LinearRegressionHandler();
    experiment = createExperiment();
  });

  describe('Handle', () => {
    it('should output a tableResult', () => {
      linearHandler.handle(experiment, data, vars);

      expect(experiment.results).toHaveLength(1);

      const result = experiment.results[0] as TableResult;

      expect(result.headers).toHaveLength(7);
      data.coefficients.forEach((coef, index) => {
        expect(result.data[index][1]).toBe(coef.Estimate);
        expect(result.data[index][2]).toBe(coef['Std. Error']);
        expect(result.data[index][3]).toBe(coef['z-value']);
        expect(result.data[index][4]).toBe(coef['p-value']);
        expect(result.data[index][5]).toBe(coef['low0.95CI']);
        expect(result.data[index][6]).toBe(coef['high0.95CI']);
      });
    });
  });
});
