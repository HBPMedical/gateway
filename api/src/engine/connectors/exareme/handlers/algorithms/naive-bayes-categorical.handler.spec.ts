import { Domain } from '../../../../models/domain.model'
import { Experiment } from '../../../../models/experiment/experiment.model'
import NaiveBayesGaussianHandler from './naive-bayes-gaussian.handler'

const data = [{ "confusion_matrix": { "data": [[73, 0, 342], [11, 0, 438], [147, 471, 318]], "labels": ["AD", "CN", "Other"] }, "classification_summary": { "accuracy": { "AD": { "fold0": 0.6566666666666666, "fold1": 0.7116666666666667, "fold2": 0.7983333333333333, "average": 0.7222222222222222, "stdev": 0.05831481187443392 }, "CN": { "fold0": 0.5966666666666667, "fold1": 0.655, "fold2": 0.215, "average": 0.48888888888888893, "stdev": 0.19512737213939182 }, "Other": { "fold0": 0.27666666666666667, "fold1": 0.38, "fold2": 0.013333333333333334, "average": 0.22333333333333336, "stdev": 0.15436848651726048 } }, "precision": { "AD": { "fold0": 0.6440677966101694, "fold1": 0.6862745098039216, "fold2": 0, "average": 0.4434474354713636, "stdev": 0.3140377606586527 }, "CN": { "fold0": 0, "fold1": 0, "fold2": 0, "average": 0, "stdev": 0 }, "Other": { "fold0": 0.22365988909426987, "fold1": 0.3442622950819672, "fold2": 1, "average": 0.5226407280587457, "stdev": 0.3411159538570608 } }, "recall": { "AD": { "fold0": 0.17040358744394618, "fold1": 0.18229166666666666, "fold2": 0, "average": 0.11756508470353762, "stdev": 0.08327261840050386 }, "CN": { "fold0": 0, "fold1": 0, "fold2": 0, "average": 0, "stdev": 0 }, "Other": { "fold0": 0.8962962962962963, "fold1": 0.9402985074626866, "fold2": 0.013333333333333334, "average": 0.6166427123641054, "stdev": 0.42698220397479075 } }, "fscore": { "AD": { "fold0": 0.2695035460992908, "fold1": 0.2880658436213992, "fold2": 0, "average": 0.18585646324022997, "stdev": 0.13163866812465613 }, "CN": { "fold0": 0, "fold1": 0, "fold2": 0, "average": 0, "stdev": 0 }, "Other": { "fold0": 0.35798816568047337, "fold1": 0.504, "fold2": 0.02631578947368421, "average": 0.29610131838471915, "stdev": 0.19986334939602007 } }, "n_obs": { "fold0": 1200, "fold1": 1200, "fold2": 1200 } } }]

const domain: Domain = {
  id: 'dummy-id',
  groups: [],
  rootGroup: {
    id: 'dummy-id',
  },
  datasets: [{ id: 'desd-synthdata', label: 'Dead Synthdata' }],
  variables: [
    { id: 'ppmicategory', label: 'PPMI Category' },
    { id: 'righthippocampus', label: 'Right Hippo Campus' },
  ],
}

const createExperiment = (): Experiment => ({
  id: 'dummy-id',
  name: 'Testing purpose',
  algorithm: {
    name: NaiveBayesGaussianHandler.ALGO_NAME,
  },
  datasets: ['desd-synthdata'],
  domain: 'dementia',
  variables: ['alzheimerbroadcategory'],
  coVariables: ['rightphgparahippocampalgyrus'],
  results: [],
})

describe('Naive Bayes result handler', () => {
  let NaiveBayesHandler: NaiveBayesGaussianHandler
  let experiment: Experiment

  beforeEach(() => {
    NaiveBayesHandler = new NaiveBayesGaussianHandler()
    experiment = createExperiment()
  })

  describe('handle', () => {
    it('should return exactly 2 results', () => {
      NaiveBayesHandler.handle(experiment, data, domain)

      expect(experiment.results).toHaveLength(2)
    })
  })
})
