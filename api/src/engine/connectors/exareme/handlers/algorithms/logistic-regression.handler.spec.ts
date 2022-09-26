import { Domain } from '../../../../models/domain.model';
import { Experiment } from '../../../../models/experiment/experiment.model';
import LogisticRegressionHandler from './logistic-regression.handler';

const data = [
  {
    dependent_var: 'ppmicategory',
    indep_vars: ['Intercept', 'righthippocampus'],
    summary: {
      n_obs: 714,
      coefficients: [2.6245273240614644, -1.392061918138407],
      stderr: [1.3675179284969878, 0.41070496937876727],
      lower_ci: [-0.05575856400545254, -2.197028866392417],
      upper_ci: [5.304813212128382, -0.5870949698843975],
      z_scores: [1.9191904320742843, -3.389445032145682],
      pvalues: [0.05496023796478015, 0.0007003424825299484],
      df_model: 1,
      df_resid: 712,
      r_squared_cs: 0.016553598383202917,
      r_squared_mcf: 0.02359922514841184,
      ll0: -252.5122763647322,
      ll: -246.55318230206288,
      aic: 497.10636460412576,
      bic: 506.24813052880495,
    },
  },
];

const domain: Domain = {
  id: 'dummy-id',
  groups: [],
  rootGroup: {
    id: 'dummy-id',
  },
  datasets: [{ id: 'desd-synthdata', label: 'Dead Synthdata' }],
  variables: [
    { id: 'ppmicategory', label: 'PPMI Category' },
    { id: 'righthippocampus', label: 'Right Hippo Campus' },
  ],
};

const createExperiment = (): Experiment => ({
  id: 'dummy-id',
  name: 'Testing purpose',
  algorithm: {
    name: LogisticRegressionHandler.ALGO_NAME,
  },
  datasets: ['desd-synthdata'],
  domain: 'dementia',
  variables: ['ppmicategory'],
  coVariables: ['righthippocampus'],
  results: [],
});

describe('Logistic Regression result Handler', () => {
  let logisticHandler: LogisticRegressionHandler;
  let experiment: Experiment;

  beforeEach(() => {
    logisticHandler = new LogisticRegressionHandler();
    experiment = createExperiment();
  });

  describe('handle', () => {
    it('with standard logistic algo data', () => {
      logisticHandler.handle(experiment, data, domain);

      const json = JSON.stringify(experiment.results);

      expect(json.includes(domain.variables[0].label)).toBeTruthy();
      expect(experiment.results.length).toBe(2);
    });

    it('Should be empty with another algo', () => {
      experiment.algorithm.name = 'dummy_algo';
      logisticHandler.handle(experiment, data, domain);

      expect(experiment.results.length).toBe(0);
    });
  });
});
