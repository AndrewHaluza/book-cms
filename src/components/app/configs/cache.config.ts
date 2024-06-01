import { CacheModuleOptions } from '@nestjs/cache-manager';

export default (): CacheModuleOptions => ({
  isGlobal: true,
  ttl: 30000,
});
