import { Configuration } from '../models/configuration.model';

type ConnectorConfiguration = Pick<Configuration, 'hasGalaxy' | 'hasGrouping'>;

export default ConnectorConfiguration;
