import { registerAs } from '@nestjs/config';
import { parseToBoolean } from '../common/utils/shared.utils';

export default registerAs('cache', () => {
  const max = process.env.CACHE_MAX_ITEMS;
  const ttl = process.env.CACHE_TTL;
  return {
    enabled: parseToBoolean(process.env.CACHE_ENABLED, true),
    ttl: ttl ? parseInt(ttl) : 1800,
    max: max ? parseInt(max) : 100,
  };
});
