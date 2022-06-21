import { Configuration } from '../models/configuration.model';

type ConnectorConfiguration = Pick<
  Configuration,
  'contactLink' | 'hasGalaxy' | 'hasGrouping'
>;

export default ConnectorConfiguration;
