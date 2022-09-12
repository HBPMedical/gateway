import { Experiment } from '../../../../models/experiment/experiment.model';
import { HeatMapResult } from '../../../../models/result/heat-map-result.model';
import DescriptiveHandler from './descriptive.handler';

const data = {
  quants: {
    'Albumin..Mass.volume..in.Serum.or.Plasma.global': [
      3.805, 3.91, 4.1, 4.2, 4.3, 4.6, 5.095, 4.2525,
    ],
    'Alanine.aminotransferase..Enzymatic.activity.volume..in.Serum.or.Plasma.global':
      [14.205, 14.9, 16.325, 20.5, 24.15, 35.08, 40.76, 22.4257],
  },
  heatmaps: [
    [
      {
        '1': [
          [0, 1, -2],
          [-3, 4, 5],
          [6, -7, 8],
        ],
        xlab: 'Albumin..Mass.volume..in.Serum.or.Plasma',
        ylab: 'Alanine.aminotransferase..Enzymatic.activity.volume..in.Serum.or.Plasma',
        x: [
          3.4371, 3.5494, 3.6617, 3.774, 3.8863, 3.9986, 4.1109, 4.2233, 4.3356,
          4.4479,
        ],
        y: [5.2062, 11.7548, 18.3034, 24.852, 31.4006, 37.9492, 44.4978],
      },
    ],
  ],
};

const invMatrix = [
  [0, -3, 6],
  [1, 4, -7],
  [-2, 5, 8],
];

const createExp = (): Experiment => ({
  id: 'dummy-id',
  name: 'Testing purpose',
  algorithm: {
    name: DescriptiveHandler.ALGO_NAME,
  },
  datasets: ['dataset1', 'dataset2'],
  domain: 'sophia',
  variables: [
    'Alanine.aminotransferase..Enzymatic.activity.volume..in.Serum.or.Plasma',
  ],
  coVariables: ['Albumin..Mass.volume..in.Serum.or.Plasma.global'],
  results: [],
});

describe('Descriptive handler', () => {
  let descriptiveHandler: DescriptiveHandler;
  let exp: Experiment;

  beforeEach(() => {
    descriptiveHandler = new DescriptiveHandler();
    exp = createExp();
  });

  describe('handle standard', () => {
    it('should output 3 results', () => {
      descriptiveHandler.handle(exp, data, []);
      const heatmapResult = exp.results[2] as HeatMapResult;

      expect(exp.results).toHaveLength(3);
      expect(heatmapResult.matrix).toStrictEqual(invMatrix);
    });
  });

  describe('handle without heatmaps', () => {
    it('should output only 2 results', () => {
      const specificData = { ...data, heatmaps: [] };
      descriptiveHandler.handle(exp, specificData, []);

      expect(exp.results).toHaveLength(2);
    });
  });
});
