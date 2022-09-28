import { Experiment } from '../../../../models/experiment/experiment.model';
import TtestIndependentHandler from './ttest-independent.handler';

const data = [
  {
    t_stat: 167.79155102952237,
    df: 4140.0,
    p: 0.0,
    mean_diff: 2.6412097730564965,
    se_diff: 0.015741017690406738,
    ci_upper: 2.6421969013992093,
    ci_lower: 2.6402226447137838,
    cohens_d: 5.214288266060559,
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
