import { Domain } from 'src/engine/models/domain.model';
import { Experiment } from '../../../../models/experiment/experiment.model';
import LinearRegressionHandler from './linear-regression.handler';

const data = {
  dependent_var: 'lefthippocampus',
  n_obs: 15431,
  df_resid: 1540.0,
  df_model: 2.0,
  rse: 0.1270107560405171,
  r_squared: 0.8772983534917347,
  r_squared_adjusted: 0.8771390007040616,
  f_stat: 5505.38441342865,
  f_pvalue: 0.0,
  indep_vars: ['Intercept', 'righthippocampus', 'leftamygdala'],
  coefficients: [0.2185676251985193, 0.611894589820809, 1.0305204881766319],
  std_err: [0.029052606790014847, 0.016978263425746872, 0.05180007458246667],
  t_stats: [7.523167431352125, 36.03988078621131, 19.894189274496593],
  pvalues: [
    9.04278019740564e-14, 8.833386164556705e-207, 1.4580450464941301e-78,
  ],
  lower_ci: [0.16158077395909892, 0.5785916308422961, 0.9289143512210847],
  upper_ci: [0.2755544764379397, 0.6451975487993219, 1.132126625132179],
};

const domain: Domain = {
  id: 'dummy-id',
  groups: [],
  rootGroup: {
    id: 'dummy-id',
  },
  datasets: [{ id: 'desd-synthdata', label: 'Dead Synthdata' }],
  variables: [
    { id: 'lefthippocampus', label: 'Left Hippo Campus' },
    { id: 'righthippocampus', label: 'Right Hippo Campus' },
    { id: 'leftamygdala', label: 'Left Amygdala' },
  ],
};

const createExperiment = (): Experiment => ({
  id: 'dummy-id',
  name: 'Testing purpose',
  algorithm: {
    name: 'LINEAR_REGRESSION',
  },
  datasets: ['desd-synthdata'],
  domain: 'dementia',
  variables: ['lefthippocampus'],
  coVariables: ['righthippocampus', 'leftamygdala'],
  results: [],
});

describe('Linear regression result handler', () => {
  let linearHandler: LinearRegressionHandler;
  let experiment: Experiment;

  beforeEach(() => {
    linearHandler = new LinearRegressionHandler();
    experiment = createExperiment();
  });

  describe('Handle', () => {
    it('with standard linear algo data', () => {
      linearHandler.handle(experiment, data, domain);

      const json = JSON.stringify(experiment.results);

      expect(json.includes(domain.variables[0].label)).toBeTruthy();
      expect(experiment.results.length === 2);
    });
    it('Should be empty with another algo', () => {
      experiment.algorithm.name = 'dummy_algo';
      linearHandler.handle(experiment, data, domain);

      expect(experiment.results.length === 0);
    });
  });
});
