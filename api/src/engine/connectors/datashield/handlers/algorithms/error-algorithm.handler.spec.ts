import { AlertResult } from '../../../../models/result/alert-result.model';
import { Experiment } from '../../../../models/experiment/experiment.model';
import ErrorAlgorithmHandler from './error-algorithm.handler';

const vars = [];

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

const data = {
  errorMessage: [['There is an error']],
};

describe('Error handler', () => {
  let errorHandler: ErrorAlgorithmHandler;
  let exp: Experiment;

  beforeEach(() => {
    errorHandler = new ErrorAlgorithmHandler();
    exp = createExperiment();
  });

  describe('Handle', () => {
    it('should output an error message', () => {
      errorHandler.handle(exp, data, vars);

      expect(exp.results).toHaveLength(1);

      const result = exp.results[0] as AlertResult;

      expect(result.message).toBe(data.errorMessage[0][0]);
    });
  });
});
