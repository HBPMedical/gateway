import { registerAs } from '@nestjs/config';
import { parseToBoolean } from 'src/common/utils/shared.utils';

export default registerAs('cache', () => {
  return {
    enabled: parseToBoolean(process.env.CACHE_ENABLED, false),
    ttl: process.env.CACHE_TTL || undefined,
    max: process.env.CACHE_MAX_ITEMS || undefined,
  };
});
