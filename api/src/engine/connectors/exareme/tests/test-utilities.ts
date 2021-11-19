import { IEngineService } from 'src/engine/engine.interfaces';
import { Experiment } from 'src/engine/models/experiment/experiment.model';
import { ExperimentCreateInput } from 'src/engine/models/experiment/input/experiment-create.input';

const TIMEOUT_DURATION_SECONDS = 60 * 10;

const TEST_PATHOLOGIES = {
  dementia: {
    code: 'dementia',
    datasets: [
      {
        code: 'desd-synthdata',
      },
      { code: 'edsd' },
      { code: 'ppmi' },
      { code: 'fake_longitudinal' },
    ],
  },
  mentalhealth: {
    code: 'mentalhealth',
    datasets: [{ code: 'demo' }],
  },
  tbi: {
    code: 'tbi',
    datasets: [{ code: 'dummy_tbi' }],
  },
};

const createExperiment = async (
  input: ExperimentCreateInput,
  service: IEngineService,
): Promise<Experiment | undefined> => {
  return await service.createExperiment(input, false);
};

const waitForResult = (
  id: string,
  service: IEngineService,
): Promise<Experiment> =>
  new Promise((resolve, reject) => {
    let elapsed = 0;
    const timerId = setInterval(async () => {
      const experiment = await service.getExperiment(id);

      const loading = experiment ? experiment.status === 'pending' : true;

      if (!loading) {
        clearInterval(timerId);
        resolve(experiment);
      }

      if (elapsed > TIMEOUT_DURATION_SECONDS) {
        clearInterval(timerId);
        reject(
          `Query experiment ${experiment.id} timeout after ${TIMEOUT_DURATION_SECONDS} s`,
        );
      }

      elapsed = elapsed + 0.3;
    }, 300);
  });

const uid = (): string =>
  'xxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;

    return v.toString(16);
  });

export {
  createExperiment,
  uid,
  waitForResult,
  TEST_PATHOLOGIES,
  TIMEOUT_DURATION_SECONDS,
};
