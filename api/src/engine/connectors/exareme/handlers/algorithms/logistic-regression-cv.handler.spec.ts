import { Domain } from '../../../../models/domain.model';
import { Experiment } from '../../../../models/experiment/experiment.model';
import LogisticRegressionCVHandler from './logistic-regression-cv.handler';

const data = [
  {
    dependent_var: 'gender',
    indep_vars: [
      'Intercept',
      'ppmicategory[PD]',
      'ppmicategory[PRODROMA]',
      'lefthippocampus',
      'righthippocampus',
    ],
    summary: {
      row_names: ['fold_1', 'fold_2', 'average', 'stdev'],
      n_obs: [40, 40, null, null],
      accuracy: [0.575, 0.5, 0.5375, 0.053033008588991036],
      precision: [
        0.5833333333333334, 0.45, 0.5166666666666667, 0.09428090415820635,
      ],
      recall: [
        0.3684210526315789, 0.5, 0.4342105263157895, 0.09304036594559838,
      ],
      fscore: [
        0.4516129032258065, 0.4736842105263158, 0.46264855687606116,
        0.015606771061842295,
      ],
    },
    confusion_matrix: { tp: 16, fp: 16, tn: 27, fn: 21 },
    roc_curves: [
      {
        name: 'fold_0',
        tpr: [0.0, 0.0, 0.3684210526315789, 0.6842105263157895, 1.0],
        fpr: [0.0, 0.0, 0.23809523809523814, 0.6666666666666667, 1.0],
        auc: 0.550125313283208,
      },
      {
        name: 'fold_1',
        tpr: [0.0, 0.0, 0.5, 1.0, 1.0],
        fpr: [0.0, 0.09090909090909094, 0.5, 0.9545454545454546, 1.0],
        auc: 0.48863636363636365,
      },
    ],
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
  datasetsVariables: {
    'desd-synthdata': ['ppmicategory', 'righthippocampus'],
  },
};

const createExperiment = (): Experiment => ({
  id: 'dummy-id',
  name: 'Testing purpose',
  algorithm: {
    name: LogisticRegressionCVHandler.ALGO_NAME,
  },
  datasets: ['desd-synthdata'],
  domain: 'dementia',
  variables: ['ppmicategory'],
  coVariables: ['righthippocampus'],
  results: [],
});

describe('Logistic regression CV result handler', () => {
  let logisticCVHandler: LogisticRegressionCVHandler;
  let experiment: Experiment;

  beforeEach(() => {
    logisticCVHandler = new LogisticRegressionCVHandler();
    experiment = createExperiment();
  });

  describe('handle', () => {
    it('should return exactly 3 results', () => {
      logisticCVHandler.handle(experiment, data, domain);

      expect(experiment.results).toHaveLength(3);
    });
  });
});
