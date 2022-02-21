import { Logger } from '@nestjs/common';
import { AlgoResults } from 'src/common/interfaces/utilities.interface';
import ResultHandler from './result-handler.interface';

export default abstract class BaseHandler implements ResultHandler {
  protected static readonly logger = new Logger(this.name);

  next: ResultHandler = null;

  setNext(h: ResultHandler): ResultHandler {
    this.next = h;
    return h;
  }

  handle(algorithm: string, data: unknown, res: AlgoResults): void {
    this.next?.handle(algorithm, data, res);
  }
}
