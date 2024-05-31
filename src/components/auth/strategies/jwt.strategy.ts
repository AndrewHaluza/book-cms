import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { SessionUser } from '../../users/dto/session-user.dto';
import { AUTH_CONSTANTS } from '../constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: AUTH_CONSTANTS.jwt.secret,
    });
  }

  validate(
    payload: SessionUser & {
      exp: number;
      iat: number;
    },
  ): SessionUser {
    const { id, email, role } = payload;

    return { id, email, role };
  }
}
