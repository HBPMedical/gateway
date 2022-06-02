import { Test, TestingModule } from '@nestjs/testing';
import { GroupsResult } from 'src/engine/models/result/groups-result.model';
import { TableResult } from 'src/engine/models/result/table-result.model';
import { AppModule } from '../../../../../main/app.module';
import { ENGINE_SERVICE } from '../../../../engine.constants';
import { IEngineService } from '../../../../engine.interfaces';
import { ExperimentCreateInput } from '../../../../../experiments/models/input/experiment-create.input';
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
  const modelSlug = `statistics-${generateNumber()}`;
  const algorithmId = 'DESCRIPTIVE_STATS';

  const input: ExperimentCreateInput = {
    name: modelSlug,
    variables: ['lefthippocampus', 'alzheimerbroadcategory'],
    datasets: TEST_PATHOLOGIES.dementia.datasets
      .filter((d) => d.code !== 'fake_longitudinal')
      .map((d) => d.code),
    domain: TEST_PATHOLOGIES.dementia.code,
    algorithm: {
      id: algorithmId,
      type: 'string',
      parameters: [],
    },
    filter: '',
    transformations: [
      {
        id: 'lefthippocampus',
        operation: 'standardize',
      },
    ],
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
      const r0 = experimentResult.results[0] as GroupsResult;
      const table = r0.groups[0].results[0] as TableResult;

      expect(table.data[0][2]).toEqual(474);
    });
  });
});
