import { registerAs } from '@nestjs/config';
import { parseToBoolean } from 'src/common/utils/shared.utils';

export default registerAs('cache', () => {
  const max = process.env.CACHE_MAX_ITEMS;
  const ttl = process.env.CACHE_TTL;
  return {
    enabled: parseToBoolean(process.env.CACHE_ENABLED, false),
    ttl: ttl ? parseInt(ttl) : undefined,
    max: max ? parseInt(max) : undefined,
  };
});
