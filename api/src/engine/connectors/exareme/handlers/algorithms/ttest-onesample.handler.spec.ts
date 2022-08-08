import { TableResult } from '../../../../models/result/table-result.model';
import { Experiment } from '../../../../models/experiment/experiment.model';
import TtestOnesampleHandler from './ttest-onesample.handler';

const data = {
  n_obs: 1991,
  t_value: 304.98272738655413,
  p_value: 0.0,
  df: 1990.0,
  mean_diff: 220.17867654445,
  se_diff: 0.7464781919192859,
  ci_upper: 221.64263732187715,
  ci_lower: 218.71471576702288,
  cohens_d: 6.835017232945105,
};

const createExperiment = (): Experiment => ({
  id: 'dummy-id',
  name: 'Testing purpose',
  algorithm: {
    name: TtestOnesampleHandler.ALGO_NAME.toUpperCase(),
  },
  datasets: ['desd-synthdata'],
  domain: 'dementia',
  variables: ['lefthippocampus'],
  coVariables: ['righthippocampus', 'leftamygdala'],
  results: [],
});

describe('T-Test Paired handler', () => {
  let tTestOnesampleHandler: TtestOnesampleHandler;
  let experiment: Experiment;

  beforeEach(() => {
    tTestOnesampleHandler = new TtestOnesampleHandler();
    experiment = createExperiment();
  });

  describe('Handle', () => {
    it('with standard t-test algo data', () => {
      tTestOnesampleHandler.handle(experiment, data);

      const table = experiment.results[0] as TableResult;

      expect(experiment.results.length).toBe(1);
      expect(table.data.length).toBe(9);
    });

    it('Should be empty with another algo', () => {
      experiment.algorithm.name = 'dummy_algo';
      tTestOnesampleHandler.handle(experiment, data);

      expect(experiment.results.length).toBe(0);
    });
  });
});
