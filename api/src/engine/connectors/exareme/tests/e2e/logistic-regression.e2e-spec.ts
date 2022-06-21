import { Test, TestingModule } from '@nestjs/testing';
import { RawResult } from '../../../../models/result/raw-result.model';
import { AppModule } from '../../../../../main/app.module';
import { ENGINE_SERVICE } from '../../../../engine.constants';
import { ExperimentCreateInput } from '../../../../../experiments/models/input/experiment-create.input';
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
  const modelSlug = `logistic-${generateNumber()}`;
  const algorithmId = 'LOGISTIC_REGRESSION';

  const input: ExperimentCreateInput = {
    name: modelSlug,
    variables: ['gender'],
    coVariables: ['lefthippocampus'],
    datasets: TEST_PATHOLOGIES.dementia.datasets
      .filter((d) => d.code !== 'fake_longitudinal')
      .map((d) => d.code),
    domain: TEST_PATHOLOGIES.dementia.code,
    algorithm: {
      id: algorithmId,
      type: 'string',
      parameters: [
        { id: 'positive_level', value: 'M' },
        { id: 'negative_level', value: 'F' },
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

      expect(data.rawdata['data']['Coefficients'][0]).toBeCloseTo(-7.628, 3);
    });
  });
});
