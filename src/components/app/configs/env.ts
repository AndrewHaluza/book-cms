import { ConfigModuleOptions } from '@nestjs/config';

export default (): ConfigModuleOptions => ({
  envFilePath: '.env',
});
