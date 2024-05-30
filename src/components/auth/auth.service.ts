import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';

import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AUTH_CONSTANTS } from './constants';
import { AuthOutput } from './dto/auth.output';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    const hashedPassword = crypto
      .createHmac('sha256', process.env.APP_AUTH_SECRET)
      .update(password)
      .digest('hex');

    if (user && user.password === hashedPassword) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;

      return result;
    }
    return null;
  }

  signIn(user: User): AuthOutput {
    return this.#getAuthOutput(user);
  }

  async signUp(user: any): Promise<AuthOutput> {
    const foundUser = await this.usersService.findOne(user.email);

    if (foundUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = crypto
      .createHmac('sha256', process.env.APP_AUTH_SECRET)
      .update(user.password)
      .digest('hex');

    const saveUserData = { ...user, password: hashedPassword };
    const createdUser = await this.usersService.create(saveUserData);

    return this.#getAuthOutput(createdUser);
  }

  #getAuthOutput(user: User): AuthOutput {
    return {
      data: user,
      ...this.#makeJWTTokens({ userId: user.id }),
    };
  }

  #makeJWTTokens(payload: { userId: number }) {
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: AUTH_CONSTANTS.jwt.expiresIn,
      secret: AUTH_CONSTANTS.jwt.secret,
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: AUTH_CONSTANTS.jwt.refreshTokenExpiresIn,
      secret: AUTH_CONSTANTS.jwt.refreshTokenSecret,
    });

    return { accessToken, refreshToken };
  }
}
