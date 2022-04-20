import { registerAs } from '@nestjs/config';
import { parseToBoolean } from 'src/common/utilities';

export default registerAs('matomo', () => {
  return {
    enabled: parseToBoolean(process.env.MATOMO_ENABLED, false),
    urlBase: process.env.MATOMO_URL || undefined,
    siteId: process.env.MATOMO_SITE_ID || undefined,
  };
});
