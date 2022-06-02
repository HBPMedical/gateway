import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../../main/app.module';
import { ENGINE_SERVICE } from '../../../../engine.constants';
import { IEngineService } from '../../../../engine.interfaces';
import { ExperimentCreateInput } from '../../../../../experiments/models/input/experiment-create.input';
import { RawResult } from '../../../../models/result/raw-result.model';
import {
  createExperiment,
  generateNumber,
  TEST_PATHOLOGIES,
  TIMEOUT_DURATION_SECONDS,
  waitForResult,
} from '../../interfaces/test-utilities';

jest.setTimeout(1000 * TIMEOUT_DURATION_SECONDS);

describe('ExaremeService', () => {
  let exaremeService: IEngineService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    exaremeService = await moduleRef.resolve<IEngineService>(ENGINE_SERVICE);
  });
  const modelSlug = `ttest-idp-${generateNumber()}`;
  const algorithmId = 'TTEST_INDEPENDENT';

  const input: ExperimentCreateInput = {
    name: modelSlug,
    variables: [
      'rightpcggposteriorcingulategyrus',
      'leftpcggposteriorcingulategyrus',
      'rightacgganteriorcingulategyrus',
      'leftacgganteriorcingulategyrus',
      'rightmcggmiddlecingulategyrus',
      'leftmcggmiddlecingulategyrus',
      'rightphgparahippocampalgyrus',
    ],
    coVariables: ['gender'],
    datasets: TEST_PATHOLOGIES.dementia.datasets
      .filter((d) => d.code !== 'fake_longitudinal')
      .map((d) => d.code),
    domain: TEST_PATHOLOGIES.dementia.code,
    algorithm: {
      id: algorithmId,
      type: 'string',
      parameters: [
        {
          id: 'xlevels',
          value: 'M,F',
        },
        {
          id: 'testvalue',
          value: '3.0',
        },
        {
          id: 'hypothesis',
          value: 'greaterthan',
        },
        {
          id: 'effectsize',
          value: '1',
        },
        {
          id: 'ci',
          value: '1',
        },
        {
          id: 'meandiff',
          value: '1',
        },
      ],
    },
    filter: '',
  };

  describe('Integration Test for experiment API', () => {
    it(`create ${algorithmId}`, async () => {
      const experiment = await createExperiment(input, exaremeService);

      expect(experiment).toBeTruthy();
      expect(experiment?.status).toStrictEqual('pending');

      expect(experiment?.id).toBeTruthy();

      const experimentResult = await waitForResult(
        experiment?.id ?? '',
        exaremeService,
      );

      expect(experimentResult).toBeTruthy();
      expect(experimentResult.status).toStrictEqual('success');
      expect(experimentResult.results.length).toBeGreaterThanOrEqual(1);
      const data = experimentResult.results[0] as RawResult;

      expect(data.rawdata['data'][0]['t_value']).toBeCloseTo(18.477, 3);
    });
  });
});
