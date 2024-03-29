import { Test, TestingModule } from '@nestjs/testing';
import EngineService from '../../../../../engine/engine.service';
import { ExperimentCreateInput } from '../../../../../experiments/models/input/experiment-create.input';
import { AppModule } from '../../../../../main/app.module';
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
  let exaremeService: EngineService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    exaremeService = await moduleRef.resolve<EngineService>(EngineService);
  });
  const modelSlug = `ttest-1s-${generateNumber()}`;
  const algorithmId = 'TTEST_ONESAMPLE';

  const input: ExperimentCreateInput = {
    name: modelSlug,
    variables: ['righthippocampus', 'lefthippocampus'],
    coVariables: ['gender', ' alzheimerbroadcategory'],
    datasets: TEST_PATHOLOGIES.dementia.datasets
      .filter((d) => d.code !== 'fake_longitudinal')
      .map((d) => d.code),
    domain: TEST_PATHOLOGIES.dementia.code,
    algorithm: {
      id: algorithmId,
      type: 'string',
      parameters: [
        {
          id: 'testvalue',
          value: '3.0',
        },
        {
          id: 'hypothesis',
          value: 'different',
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

      expect(data.rawdata['data'][0]['t_value']).toBeCloseTo(8.155, 3);
    });
  });
});
