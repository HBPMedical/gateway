import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../../main/app.module';
import { ENGINE_SERVICE } from '../../../../engine.constants';
import { ExperimentCreateInput } from '../../../../../experiments/models/input/experiment-create.input';
import { RawResult } from '../../../../models/result/raw-result.model';
import {
  createExperiment,
  generateNumber,
  TEST_PATHOLOGIES,
  TIMEOUT_DURATION_SECONDS,
  waitForResult,
} from '../../interfaces/test-utilities';
import EngineService from '../../../../interfaces/engine-service.interface';

jest.setTimeout(1000 * TIMEOUT_DURATION_SECONDS);

describe('ExaremeService', () => {
  let exaremeService: EngineService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    exaremeService = await moduleRef.resolve<EngineService>(ENGINE_SERVICE);
  });
  const modelSlug = `naivebayes-${generateNumber()}`;
  const algorithmId = 'NAIVE_BAYES';

  const input: ExperimentCreateInput = {
    name: modelSlug,
    variables: ['alzheimerbroadcategory'],
    coVariables: ['righthippocampus', 'lefthippocampus'],
    datasets: TEST_PATHOLOGIES.dementia.datasets
      .filter((d) => d.code !== 'fake_longitudinal')
      .map((d) => d.code),
    domain: TEST_PATHOLOGIES.dementia.code,
    algorithm: {
      id: algorithmId,
      type: 'string',
      parameters: [
        {
          id: 'alpha',
          value: '0.1',
        },
        {
          id: 'k',
          value: '10',
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

      expect(experimentResult.results.length).toBeGreaterThanOrEqual(5);
      const data = experimentResult.results[0] as RawResult;

      expect(data.rawdata['data']['precision'][0]).toBeCloseTo(0.517, 3);
    });
  });
});
