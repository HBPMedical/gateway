import { Results } from 'src/common/interfaces/utilities.interface';
import ResultHandler from './result-handler.interface';

export default abstract class BaseHandler implements ResultHandler {
  next: ResultHandler = null;

  setNext(h: ResultHandler): void {
    this.next = h;
  }

  handle(data: JSON, res: Results): void {
    this.next?.handle(data, res);
  }
}
