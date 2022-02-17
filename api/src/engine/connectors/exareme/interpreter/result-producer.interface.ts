import { ResultUnion } from 'src/engine/models/result/common/result-union.model';

// produce algo handler
export default interface ResultProducer {
  interpret(data: unknown): Array<typeof ResultUnion>;
}
