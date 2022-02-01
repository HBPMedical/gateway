import { Test, TestingModule } from '@nestjs/testing';
import { RawResult } from 'src/engine/models/result/raw-result.model';
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
  const modelSlug = `id3-${generateNumber()}`;
  const algorithmId = 'ID3';

  const input: ExperimentCreateInput = {
    name: modelSlug,
    variables: ['alzheimerbroadcategory'],
    coVariables: ['gender', 'agegroup'],
    datasets: TEST_PATHOLOGIES.dementia.datasets
      .filter((d) => d.code !== 'fake_longitudinal')
      .map((d) => d.code),
    domain: TEST_PATHOLOGIES.dementia.code,
    algorithm: {
      id: algorithmId,
      type: 'string',
      parameters: [{ id: 'iterations_max_number', value: '20' }],
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

      expect(experimentResult.results.length).toBeGreaterThanOrEqual(2);
      const data = experimentResult.results[0] as RawResult;

      expect(data.rawdata['data']['data'][0][2]).toEqual('+80y');
    });
  });
});
