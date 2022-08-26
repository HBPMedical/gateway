import { Logger } from '@nestjs/common';
import { Variable } from '../../../models/variable.model';
import { Experiment } from '../../../models/experiment/experiment.model';
import ResultHandler from './result-handler.interface';

export default abstract class BaseHandler implements ResultHandler {
  protected static readonly logger = new Logger(this.name);

  next: ResultHandler = null;

  setNext(h: ResultHandler): ResultHandler {
    this.next = h;
    return h;
  }

  handle(experiment: Experiment, data: unknown, vars: Variable[]): void {
    this.next?.handle(experiment, data, vars);
  }
}
