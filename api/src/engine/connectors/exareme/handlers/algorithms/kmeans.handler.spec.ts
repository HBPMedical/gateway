import { Domain } from '../../../../models/domain.model'
import handlers from '..'
import { Experiment } from '../../../../models/experiment/experiment.model'
import KMeansHandler from './kmeans.handler'

const createExperiment = (): Experiment => ({
  id: 'dummy-id',
  name: 'Testing purpose',
  algorithm: {
    name: KMeansHandler.ALGO_NAME,
  },
  datasets: ['desd-synthdata,edsd,ppmi'],
  domain: 'dementia:0.1',
  variables: ['rightphgparahippocampalgyrus,leftacgganteriorcingulategyrus,rightmcggmiddlecingulategyrus'],
  coVariables: [''],
  results: [],
})

const domain: Domain = {
  id: 'dummy-id',
  groups: [],
  rootGroup: {
    id: 'dummy-id',
  },
  datasets: [
    { id: 'desd-synthdata', label: 'Dead Synthdata' },
    { id: 'edsd', label: 'Dead Synthdata' },
    { id: 'ppmi', label: 'Dead Synthdata' }
  ],
  variables: [
    { id: 'rightcerebralwhitematter', label: 'Example label' },
    { id: 'leftacgganteriorcingulategyrus', label: 'Example label 2' },
    { id: 'rightmcggmiddlecingulategyrus', label: 'Example label 3' },
  ],
}

const data = [{ "title": "K-Means Centers", "centers": [[2.416308695652174, 0.49923478260869575, 0.6704447826086956], [2.8008268934531437, 4.355844159178429, 4.368724582798459], [3.1799977551020424, 5.278902244897958, 5.245970816326524]] }]

describe('KMeans result handler', () => {
  let kmeansHandler:  KMeansHandler;
  let experiment: Experiment;

  beforeEach(() => {
    kmeansHandler = new KMeansHandler();
    experiment = createExperiment();
  });

  it('Test kmeans 3d handler', () => {
    experiment = createExperiment();
    kmeansHandler.handle(experiment, data, domain);

    expect(experiment.results.length).toBe(2);

    const table = kmeansHandler.getTable(data[0].centers);
    const plot = kmeansHandler.getCluster(data[0]);

    expect(table.data[0].length).toEqual(3);
    expect(table.headers.length).toEqual(3);
    expect(table.data).toBeTruthy();

    expect(plot.nmatrix).toBeTruthy()

  })
})
