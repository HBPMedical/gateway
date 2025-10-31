import { Domain } from '../../../../models/domain.model';
import handlers from '..';
import { Experiment } from '../../../../models/experiment/experiment.model';
import AnovaTwoWayHandler from './anova-two-way.handler';

const createExperiment = (): Experiment => ({
  id: 'dummy-id',
  name: 'Testing purpose',
  algorithm: {
    name: AnovaTwoWayHandler.ALGO_NAME,
  },
  datasets: ['desd-synthdata'],
  domain: 'dementia',
  variables: ['parkinsonbroadcategory'],
  coVariables: ['gender'],
  results: [],
});

const domain: Domain = {
  id: 'dummy-id',
  groups: [],
  rootGroup: {
    id: 'dummy-id',
  },
  datasets: [{ id: 'desd-synthdata', label: 'Dead Synthdata' }],
  variables: [
    { id: 'parkinsonbroadcategory', label: 'Example label' },
    { id: 'gender', label: 'Example label 2' },
    { id: 'parkinsonbroadcategory:gender', label: 'Example label 3' },
  ],
  datasetsVariables: {
    'desd-synthdata': [
      'parkinsonbroadcategory',
      'gender',
      'parkinsonbroadcategory:gender',
    ],
  },
};

const data = [
  {
    terms: [
      'gender',
      'parkinsonbroadcategory',
      'gender:parkinsonbroadcategory',
      'Residuals',
    ],
    sum_sq: [
      122.2949665988383, 33.327112053403425, 0.8516104180441744,
      1801.7985931306575,
    ],
    df: [1.0, 2.0, 2.0, 708.0],
    f_stat: [48.05466975170338, 6.547789365517223, 0.16731619679191115, null],
    f_pvalue: [
      9.343970042152705e-12,
      0.0015216347633810745,
      0.8459655267774153,
      null,
    ],
  },
];

describe('Anova 2 way result handler', () => {
  const anovaHandler = new AnovaTwoWayHandler();

  it('Test anova 2 way handler', () => {
    const exp = createExperiment();
    const summaryTable = anovaHandler.getSummaryTable(
      data[0],
      domain.variables,
    );

    handlers(exp, data, domain);

    expect(exp.results.length).toBeGreaterThanOrEqual(1);

    expect(summaryTable.data.length).toEqual(4);
  });
});
