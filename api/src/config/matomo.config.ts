import { registerAs } from '@nestjs/config';

export default registerAs('matomo', () => {
  return {
    enabled: process.env.MATOMO_ENABLED || false,
    urlBase: process.env.MAMOTO_URL || '',
    siteId: process.env.MATOMO_SITEID || undefined,
  };
});
