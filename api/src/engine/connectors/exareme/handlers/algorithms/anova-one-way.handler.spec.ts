import handlers from '..';
import { Experiment } from '../../../../models/experiment/experiment.model';
import AnovaOneWayHandler from './anova-one-way.handler';

const createExperiment = (): Experiment => ({
  id: 'dummy-id',
  name: 'Testing purpose',
  algorithm: {
    id: 'Anova_OnEway',
  },
  datasets: ['desd-synthdata'],
  domain: 'dementia',
  variables: ['rightcerebralwhitematter'],
  coVariables: ['ppmicategory'],
  results: [],
});

describe('Anova oneway result handler', () => {
  const anovaHandler = new AnovaOneWayHandler();
  const data = {
    df_residual: 1424.0,
    df_explained: 3.0,
    ss_residual: 1941.1517872154072,
    ss_explained: 23.52938815624377,
    ms_residual: 1.3631683898984601,
    ms_explained: 7.843129385414589,
    p_value: 0.0006542139533101455,
    f_stat: 5.753602741623733,
    tuckey_test: [
      {
        groupA: 'GENPD',
        groupB: 'HC',
        meanA: 10.200898765432095,
        meanB: 10.50253333333334,
        diff: -0.3016345679012442,
        se: 0.11017769051976001,
        t_stat: -2.737710025308137,
        p_tuckey: 0.03178790563153744,
      },
      {
        groupA: 'GENPD',
        groupB: 'PD',
        meanA: 10.200898765432095,
        meanB: 10.530083456790125,
        diff: -0.3291846913580301,
        se: 0.10048653456497285,
        t_stat: -3.2759084864767125,
        p_tuckey: 0.005936908999390811,
      },
      {
        groupA: 'GENPD',
        groupB: 'PRODROMA',
        meanA: 10.200898765432095,
        meanB: 10.161453333333334,
        diff: 0.039445432098760946,
        se: 0.1534957169892615,
        t_stat: 0.2569806693793321,
        p_tuckey: 0.9,
      },
      {
        groupA: 'HC',
        groupB: 'PD',
        meanA: 10.50253333333334,
        meanB: 10.530083456790125,
        diff: -0.02755012345678587,
        se: 0.07353521425604895,
        t_stat: -0.37465211375949203,
        p_tuckey: 0.9,
      },
      {
        groupA: 'HC',
        groupB: 'PRODROMA',
        meanA: 10.50253333333334,
        meanB: 10.161453333333334,
        diff: 0.34108000000000516,
        se: 0.13737110045731235,
        t_stat: 2.4829094246500176,
        p_tuckey: 0.0630887851749381,
      },
      {
        groupA: 'PD',
        groupB: 'PRODROMA',
        meanA: 10.530083456790125,
        meanB: 10.161453333333334,
        diff: 0.368630123456791,
        se: 0.1297275582960786,
        t_stat: 2.8415714309172655,
        p_tuckey: 0.02355122851783331,
      },
    ],
    min_per_group: [
      {
        GENPD: 7.2276,
        HC: 7.2107,
        PD: 7.0258,
        PRODROMA: 6.3771,
      },
    ],
    max_per_group: [
      {
        GENPD: 13.7312,
        HC: 14.52,
        PD: 14.4812,
        PRODROMA: 12.3572,
      },
    ],
    ci_info: {
      sample_stds: {
        GENPD: 1.2338388511229372,
        HC: 1.1276421260632183,
        PD: 1.16245855322075,
        PRODROMA: 1.197046185656396,
      },
      means: {
        GENPD: 10.200898765432095,
        HC: 10.50253333333334,
        PD: 10.530083456790125,
        PRODROMA: 10.161453333333334,
      },
      'm-s': {
        GENPD: 8.967059914309157,
        HC: 9.374891207270121,
        PD: 9.367624903569375,
        PRODROMA: 8.964407147676939,
      },
      'm+s': {
        GENPD: 11.434737616555033,
        HC: 11.630175459396558,
        PD: 11.692542010010875,
        PRODROMA: 11.35849951898973,
      },
    },
  };

  it('Test anova 1 way handler', () => {
    const exp = createExperiment();
    const table1 = anovaHandler.getSummaryTable(data, exp.coVariables[0]);
    const table2 = anovaHandler.getTuckeyTable(data);
    const meanPlot = anovaHandler.getMeanPlot(data);

    handlers(exp, data);

    expect(exp.results.length).toBeGreaterThanOrEqual(3);
    expect(exp.results).toContainEqual(table1);
    expect(exp.results).toContainEqual(table2);
    expect(exp.results).toContainEqual(meanPlot);

    expect(table1.data[0].length).toEqual(6);
    expect(table2.headers.length).toEqual(8);
    expect(table2.data).toBeTruthy();

    expect(meanPlot.pointCIs.length).toBeGreaterThan(1);
  });
});
