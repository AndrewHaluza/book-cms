import { ThrottlerModuleOptions } from '@nestjs/throttler';

export default (): ThrottlerModuleOptions => [
  {
    ttl: 60000,
    limit: 10,
    name: 'default',
  },
];
