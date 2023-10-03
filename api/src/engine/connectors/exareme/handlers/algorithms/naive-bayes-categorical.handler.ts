import { Domain } from '../../../../models/domain.model';
import { Experiment } from '../../../../models/experiment/experiment.model';
import NaiveBayesGaussianCVHandler from './naive-bayes-gaussian.handler';

export default class NaiveBayesCategoricalCVHandler extends NaiveBayesGaussianCVHandler {
  public static readonly ALGO_NAMEE = 'naive_bayes_categorical_cv';

  private canHandle2(experiment: Experiment, data: unknown): boolean {
    return (
      experiment.algorithm.name.toLowerCase() ===
      NaiveBayesCategoricalCVHandler.ALGO_NAMEE
    );
  }

  handle(experiment: Experiment, data: unknown, domain?: Domain): void {
    if (!this.canHandle2(experiment, data))
      return super.handle(experiment, data, domain);

    const extractedData = data[0];

    const varIds = [...experiment.variables, ...(experiment.coVariables ?? [])];
    const variables = domain.variables.filter((v) => varIds.includes(v.id));

    let jsonData = JSON.stringify(extractedData);

    variables.forEach((v) => {
      const regEx = new RegExp(v.id, 'gi');
      jsonData = jsonData.replaceAll(regEx, v.label);
    });

    const improvedData = JSON.parse(jsonData);

    const results = [
      this.getConfusionMatrix(improvedData),
      this.getClassificationSummary(improvedData),
    ];

    results
      .filter((r) => !!r)
      .forEach((r) => {
        experiment.results.push(r);
      });
  }
}
