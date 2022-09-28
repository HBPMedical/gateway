import { Experiment } from '../../../../models/experiment/experiment.model';
import TtestIndependentHandler from './ttest-independent.handler';

const data = [
  {
    n_obs: 2592,
    t_stat: 134.30687412180572,
    p: 1.0,
    df: 2590,
    mean_diff: 2.649063055555556,
    se_diff: 0.01972395733931731,
    ci_upper: 2.6815226463968456,
    ci_lower: -Infinity,
    cohens_d: 5.276072302860936,
  },
];

const createExperiment = (): Experiment => ({
  id: 'dummy-id',
  name: 'Testing purpose',
  algorithm: {
    name: TtestIndependentHandler.ALGO_NAME.toUpperCase(),
  },
  datasets: ['desd-synthdata'],
  domain: 'dementia',
  variables: ['rightgregyrusrectus'],
  coVariables: ['leftamygdala'],
  results: [],
});

describe('T-test Independent handler', () => {
  let ttestIndependentHandler: TtestIndependentHandler;
  let experiment: Experiment;

  beforeEach(() => {
    ttestIndependentHandler = new TtestIndependentHandler();
    experiment = createExperiment();
  });

  describe('Handle', () => {
    it('with standard t-test algo data', () => {
      ttestIndependentHandler.handle(experiment, data);

      expect(experiment.results.length).toBe(1);
    });

    it('Should be empty with another algo', () => {
      experiment.algorithm.name = 'dummy_algo';
      ttestIndependentHandler.handle(experiment, data);

      expect(experiment.results.length).toBe(0);
    });
  });
});
