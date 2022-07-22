import { TableResult } from '../../../../models/result/table-result.model';
import { Experiment } from '../../../../models/experiment/experiment.model';
import TTestPairedHandler from './ttest-paired.handler';

const data = {
  t_stat: -97.35410837992711,
  p: 1.0,
  df: 144.0,
  mean_diff: -66.00088551724139,
  se_diff: 0.6779465871093092,
  ci_upper: 'Infinity',
  ci_lower: -67.12322892404309,
  cohens_d: -11.456478738682357,
};

const createExperiment = (): Experiment => ({
  id: 'dummy-id',
  name: 'Testing purpose',
  algorithm: {
    name: 'TTEST_PAIRED',
  },
  datasets: ['desd-synthdata'],
  domain: 'dementia',
  variables: ['lefthippocampus'],
  coVariables: ['righthippocampus', 'leftamygdala'],
  results: [],
});

describe('T-Test Paired handler', () => {
  let tTestPairedHandler: TTestPairedHandler;
  let experiment: Experiment;

  beforeEach(() => {
    tTestPairedHandler = new TTestPairedHandler();
    experiment = createExperiment();
  });

  describe('Handle', () => {
    it('with standard t-test algo data', () => {
      tTestPairedHandler.handle(experiment, data);

      const table = experiment.results[0] as TableResult;

      expect(experiment.results.length === 1);
      expect(table.data.length === 7);
    });

    it('Should be empty with another algo', () => {
      experiment.algorithm.name = 'dummy_algo';
      tTestPairedHandler.handle(experiment, data);

      expect(experiment.results.length === 0);
    });
  });
});
