import { Experiment } from '../../../../models/experiment/experiment.model';
import LogisticRegressionHandler from './logistic-regression.handler';

const data = {
  Nvalid: 214,
  Nmissing: 0,
  Ntotal: 214,
  'disclosure.risk': [[0], [0]],
  errorMessage: [['No errors'], ['No errors']],
  nsubs: 214,
  iter: 6,
  formula:
    'race ~ Urea.nitrogen..Mass.volume..in.Serum.or.Plasma + Albumin..Mass.volume..in.Serum.or.Plasma',
  coefficients: [
    {
      Estimate: -4.53,
      'Std. Error': 3.4497,
      'z-value': -1.3132,
      'p-value': 0.1891,
      'low0.95CI.LP': -11.2914,
      'high0.95CI.LP': 2.2313,
      P_OR: 0.0107,
      'low0.95CI.P_OR': 0,
      'high0.95CI.P_OR': 0.903,
      _row: '(Intercept)',
    },
    {
      Estimate: 0.0598,
      'Std. Error': 0.0663,
      'z-value': 0.9023,
      'p-value': 0.3669,
      'low0.95CI.LP': -0.0701,
      'high0.95CI.LP': 0.1898,
      P_OR: 1.0617,
      'low0.95CI.P_OR': 0.9323,
      'high0.95CI.P_OR': 1.209,
      _row: 'Urea.nitrogen..Mass.volume..in.Serum.or.Plasma',
    },
    {
      Estimate: 0.4569,
      'Std. Error': 0.7518,
      'z-value': 0.6078,
      'p-value': 0.5433,
      'low0.95CI.LP': -1.0166,
      'high0.95CI.LP': 1.9304,
      P_OR: 1.5792,
      'low0.95CI.P_OR': 0.3618,
      'high0.95CI.P_OR': 6.8926,
      _row: 'Albumin..Mass.volume..in.Serum.or.Plasma',
    },
  ],
  dev: 172.4603,
  df: 211,
  'output.information':
    'SEE TOP OF OUTPUT FOR INFORMATION ON MISSING DATA AND ERROR MESSAGES',
};

const createExperiment = (): Experiment => ({
  id: 'dummy-id',
  name: 'Testing purpose',
  algorithm: {
    name: 'logistic-regression',
    parameters: [
      {
        name: 'pos-level',
        value: 'White',
      },
    ],
  },
  datasets: ['sophia.db'],
  domain: 'dementia',
  variables: ['race'],
  coVariables: [
    'Urea.nitrogen..Mass.volume..in.Serum.or.Plasma',
    'Albumin..Mass.volume..in.Serum.or.Plasma',
  ],
  results: [],
});

describe('Logistic Regression Handler', () => {
  describe('Normal usage', () => {
    it('should return the correct results', () => {
      const experiment = createExperiment();
      const handler = new LogisticRegressionHandler();
      handler.handle(experiment, data, []);

      expect(experiment.results).toHaveLength(1);
    });
  });
});
