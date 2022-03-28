import { AlgoResults } from 'src/common/interfaces/utilities.interface';

// produce algo handler
export default interface ResultHandler {
  setNext(h: ResultHandler): ResultHandler;
  handle(algorithm: string, data: unknown, res: AlgoResults): void;
}
