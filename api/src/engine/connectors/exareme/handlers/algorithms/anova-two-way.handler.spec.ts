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
};

const data = [
  {
    terms: [
      'parkinsonbroadcategory',
      'gender',
      'parkinsonbroadcategory:gender',
      'Residuals',
    ],
    sum_sq: [
      0.7427619881331298, 0.004764818481136857, 0.008175662839327025,
      5.6058179597692295,
    ],
    df: [2, 1, 2, 74],
    f_stat: [4.902441313320338, 0.06289832636995628, 0.05396171035628005, null],
    f_pvalue: [
      0.010014025893247736,
      0.8026673646098741,
      0.9475056310046991,
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

    expect(summaryTable.data[0].length).toEqual(4);
  });
});
