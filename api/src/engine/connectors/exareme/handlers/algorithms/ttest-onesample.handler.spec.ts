import { TableResult } from '../../../../models/result/table-result.model';
import { Experiment } from '../../../../models/experiment/experiment.model';
import TtestOnesampleHandler from './ttest-onesample.handler';

const data = [
  {
    n_obs: 2071.0,
    t_stat: 443.6944404266344,
    df: 2070.0,
    std: 0.2960348288198221,
    p: 0.0,
    mean_diff: 2.886268614196039,
    se_diff: 0.006505081766228009,
    ci_upper: 2.886676576375429,
    ci_lower: 2.885860652016649,
    cohens_d: -9.749760275513832,
  },
];

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
