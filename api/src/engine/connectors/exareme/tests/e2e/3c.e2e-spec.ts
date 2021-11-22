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

  const modelSlug = `3c-${generateNumber()}`;
  const algorithmId = 'THREE_C';

  const input: ExperimentCreateInput = {
    name: modelSlug,
    variables: ['lefthippocampus', 'righthippocampus', 'leftcaudate'],
    coVariables: ['gender', 'agegroup'],
    datasets: TEST_PATHOLOGIES.dementia.datasets
      .filter((d) => d.code === 'ppmi' || d.code === 'edsd')
      .map((d) => d.code),
    domain: TEST_PATHOLOGIES.dementia.code,
    algorithm: {
      id: algorithmId,
      type: 'string',
      parameters: [
        { id: 'dx', value: ['alzheimerbroadcategory'] },
        { id: 'c2_feature_selection_method', value: ['RF'] },
        { id: 'c2_num_clusters_method', value: ['Euclidean'] },
        { id: 'c2_num_clusters', value: ['6'] },
        { id: 'c2_clustering_method', value: ['Euclidean'] },
        { id: 'c3_feature_selection_method', value: ['RF'] },
        { id: 'c3_classification_method', value: ['RF'] },
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
    });
  });
});
