import { Results } from 'src/common/interfaces/utilities.interface';

// produce algo handler
export default interface ResultHandler {
  setNext(h: ResultHandler): void;
  handle(data: JSON, res: Results): void;
}
