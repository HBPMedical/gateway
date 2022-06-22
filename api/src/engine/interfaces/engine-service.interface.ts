import Connector from './connector.interface';

export default interface EngineService extends Connector {
  has(name: keyof Connector): boolean;
}
