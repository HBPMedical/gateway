import { Domain } from 'src/engine/models/domain.model';
import { TableResult } from 'src/engine/models/result/table-result.model';
import { Experiment } from '../../../../models/experiment/experiment.model';
import LinearRegressionCVHandler from './linear-regression-cv.handler';

const data = [
  {
    dependent_var: 'leftocpoccipitalpole',
    indep_vars: [
      'Intercept',
      'righthippocampus',
      'rightsogsuperioroccipitalgyrus',
      'leftppplanumpolare',
    ],
    n_obs: [497, 498, 498, 499],
    mean_sq_error: [0.3296455054532643, 0.02930654997949175],
    r_squared: [0.5886631959286948, 0.04365853383949705],
    mean_abs_error: [0.2585157369288272, 0.019919123005319055],
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
    { id: 'leftocpoccipitalpole', label: 'Left OCP occipital Pole' },
    { id: 'righthippocampus', label: 'Right Hippo Campus' },
    { id: 'rightsogsuperioroccipitalgyrus', label: 'Right superior occipital' },
    { id: 'leftppplanumpolare', label: 'Left Planum polare' },
  ],
};

const createExperiment = (): Experiment => ({
  id: 'dummy-id',
  name: 'Testing purpose',
  algorithm: {
    name: 'LINEAR_REGRESSION_CV',
  },
  datasets: ['desd-synthdata'],
  domain: 'dementia',
  variables: ['leftocpoccipitalpole'],
  coVariables: [
    'righthippocampus',
    'rightsogsuperioroccipitalgyrus',
    'leftppplanumpolare',
  ],
  results: [],
});

describe('Linear regression CV result handler', () => {
  let linearHandler: LinearRegressionCVHandler;
  let experiment: Experiment;

  beforeEach(() => {
    linearHandler = new LinearRegressionCVHandler();
    experiment = createExperiment();
  });

  describe('Handle', () => {
    it('with standard linear algo data', () => {
      const expectedDataPoints = [
        ['Intercept', 497],
        ['Right Hippo Campus', 498],
        ['Right superior occipital', 498],
        ['Left Planum polare', 499],
      ];
      const expectedScoresData = [
        ['Root mean squared error', '0.3296', '0.02931'],
        ['R-squared', '0.5887', '0.04366'],
        ['Mean absolute error', '0.2585', '0.01992'],
      ];

      linearHandler.handle(experiment, data, domain);

      const json = JSON.stringify(experiment.results);

      expect(experiment.results.length).toEqual(2);

      const dataPoints = experiment.results[0] as TableResult;
      const scoresData = experiment.results[1] as TableResult;

      expect(dataPoints.data).toStrictEqual(expectedDataPoints);
      expect(scoresData.data).toStrictEqual(expectedScoresData);

      expect(json.includes(domain.variables[0].label)).toBeTruthy();
    });

    it('Should be empty with another algo', () => {
      experiment.algorithm.name = 'dummy_algo';
      linearHandler.handle(experiment, data, domain);

      expect(experiment.results.length).toBe(0);
    });
  });
});
