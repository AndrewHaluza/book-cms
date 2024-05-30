import { ApiProperty } from '@nestjs/swagger';

import { AUTH_CONSTANTS } from '../constants';

export class JWTTokensOutput {
  @ApiProperty({
    description: `expires in ${AUTH_CONSTANTS.jwt.expiresIn}`,
  })
  accessToken: string;

  @ApiProperty({
    description: `expires in ${AUTH_CONSTANTS.jwt.refreshTokenExpiresIn}`,
  })
  refreshToken: string;
}
