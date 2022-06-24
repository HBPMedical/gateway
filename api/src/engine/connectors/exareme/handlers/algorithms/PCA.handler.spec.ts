import { Experiment } from '../../../../models/experiment/experiment.model';
import { HeatMapResult } from '../../../../models/result/heat-map-result.model';
import handlers from '..';
import { BarChartResult } from '../../../../models/result/bar-chart-result.model';

const createExperiment = (): Experiment => ({
  id: 'dummy-id',
  name: 'Testing purpose',
  algorithm: {
    name: 'PCA',
  },
  datasets: ['desd-synthdata'],
  domain: 'dementia',
  variables: [
    'rightcerebralwhitematter',
    'rightmtgmiddletemporalgyrus',
    'rightlateralventricle',
    'lefttmptemporalpole',
    'leftcerebellumwhitematter',
    'rightporgposteriororbitalgyrus',
    'leftangangulargyrus',
    'rightcuncuneus',
  ],
  results: [],
});

describe('PCA result handler', () => {
  const data = {
    n_obs: 920,
    eigen_vals: [
      4.355128575368841, 1.0450017532423244, 0.7421875389691931,
      0.5621334410413102, 0.4449774285333259, 0.3926006044635884,
      0.24709792171717856, 0.2195778509188677,
    ],
    eigen_vecs: [
      [
        -0.39801260415007417, -0.408618968170694, -0.005388160172392957,
        -0.39520225162483835, -0.34101372698341037, -0.3857891852309699,
        -0.37808437879347245, -0.3321614049065189,
      ],
      [
        -0.08974916969984865, -0.06306725142041861, 0.957701626296451,
        -0.05813339720242487, 0.03639315522751595, -0.042472298797464114,
        -0.0024375598833834417, 0.25349834682806394,
      ],
      [
        -0.4461915539200752, 0.31570679861452433, -0.025606596993284957,
        0.30818994376586817, -0.7193269233477485, 0.18210682315923998,
        0.07424770446526184, 0.22248311387276953,
      ],
      [
        -0.1073921285806547, -0.057551147661307055, -0.24144428440227128,
        0.035245201087085794, 0.19168469965719226, -0.2871851841802395,
        -0.43040426139061094, 0.7881313641348668,
      ],
      [
        -0.08495390059838565, 0.24279781377786122, 0.13080782479311695,
        0.5200478463181943, 0.21537192596569144, 0.08500148719542867,
        -0.6763140751914142, -0.36777786677407387,
      ],
      [
        -0.0932054360289125, 0.2816208747297754, 0.02363518180881532,
        0.29984356493304964, 0.09621700712393312, -0.8213627734608029,
        0.3468941309570408, -0.1315583071518168,
      ],
      [
        -0.5592437704142699, 0.5214515551418919, -0.04356242791170582,
        -0.4758673723220084, 0.40140905254944736, 0.1444142675145091,
        0.05395624557894896, -0.0457302433772836,
      ],
      [
        -0.5424509822332161, -0.5620474388715386, -0.06527272376104105,
        0.3967451838014927, 0.3338246891755648, 0.17608817173645286,
        0.29263999750747904, -0.009909769193655195,
      ],
    ],
  };

  it('Test PCA handler with regular data (no edge cases)', () => {
    const exp = createExperiment();
    handlers(exp, data, null);
    expect(exp.results.length).toBeGreaterThanOrEqual(2);

    exp.results.forEach((it) => {
      if (it['matrix']) {
        const heatmap = it as HeatMapResult;
        const matrix = data.eigen_vecs[0].map(
          (_, i) => data.eigen_vecs.map((row) => row[i]), // reverse matrix as we want row-major order
        );
        expect(heatmap.matrix).toEqual(matrix);
        expect(heatmap.yAxis.categories).toEqual(exp.variables);
      }
    });
    exp.results.forEach((it) => {
      if (it['barValues']) {
        const barchart = it as BarChartResult;
        expect(barchart.barValues).toEqual(data.eigen_vals);
      }
    });
  });
});
