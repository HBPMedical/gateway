import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../../main/app.module';
import { ENGINE_SERVICE } from '../../../../engine.constants';
import { IEngineService } from '../../../../engine.interfaces';
import { ExperimentCreateInput } from '../../../../models/experiment/input/experiment-create.input';
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

  const modelSlug = `calibration-belt-${generateNumber()}`;
  const algorithmId = 'CALIBRATION_BELT';

  const input: ExperimentCreateInput = {
    name: modelSlug,
    variables: ['mortality_gose'],
    coVariables: ['mortality_core'],
    datasets: TEST_PATHOLOGIES.tbi.datasets
      .filter((d) => d.code !== 'fake_longitudinal')
      .map((d) => d.code),
    domain: TEST_PATHOLOGIES.tbi.code,
    algorithm: {
      id: algorithmId,
      type: 'string',
      parameters: [
        {
          id: 'devel',
          value: ['external'],
        },
        {
          id: 'max_deg',
          value: ['4'],
        },
        {
          id: 'confLevels',
          value: ['0.80,0.95'],
        },
        {
          id: 'thres',
          value: ['0.95'],
        },
        {
          id: 'num_points',
          value: ['200'],
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

      expect(experimentResult.status).toStrictEqual('success');
      expect(experimentResult).toBeTruthy();

      expect(experimentResult.results.length).toBeGreaterThanOrEqual(1);
    });
  });
});
