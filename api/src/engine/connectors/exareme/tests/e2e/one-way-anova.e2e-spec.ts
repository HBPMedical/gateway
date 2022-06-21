import { Test, TestingModule } from '@nestjs/testing';
import EngineService from '../../../../interfaces/engine-service.interface';
import { ExperimentCreateInput } from '../../../../../experiments/models/input/experiment-create.input';
import { AppModule } from '../../../../../main/app.module';
import { ENGINE_SERVICE } from '../../../../engine.constants';
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

    exaremeService = await moduleRef.resolve<EngineService>(ENGINE_SERVICE);
  });
  const modelSlug = `anova-1way-${generateNumber()}`;
  const algorithmId = 'ANOVA_ONEWAY';

  const input: ExperimentCreateInput = {
    name: modelSlug,
    variables: ['lefthippocampus'],
    coVariables: ['ppmicategory'],
    datasets: TEST_PATHOLOGIES.dementia.datasets
      .filter((d) => d.code === 'ppmi')
      .map((d) => d.code),
    domain: TEST_PATHOLOGIES.dementia.code,
    algorithm: {
      id: algorithmId,
      type: 'string',
      parameters: [],
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
      expect(experimentResult.results.length).toBeGreaterThanOrEqual(4);
    });
  });
});
