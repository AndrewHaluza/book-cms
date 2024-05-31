import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';

import { RoleService } from '../role/role.service';
import { SessionUser } from '../users/dto/session-user.dto';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AUTH_CONSTANTS } from './constants';
import { AuthOutput } from './dto/auth.output';
import { SignUpInput } from './dto/sign-up.input';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private roleService: RoleService,
  ) {}

  async validateUser(email: string, password: string): Promise<SessionUser> {
    const userWithRole = await this.usersService.findOneWithRole(email);
    const hashedPassword = crypto
      .createHmac('sha256', process.env.APP_AUTH_SECRET)
      .update(password)
      .digest('hex');

    if (userWithRole?.password === hashedPassword) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, role, ...result } = userWithRole;

      return { ...result, role: userWithRole.role.name };
    }
    return null;
  }

  signIn(user: SessionUser): AuthOutput {
    return this.#getAuthOutput(user);
  }

  async signUp(user: SignUpInput): Promise<AuthOutput> {
    const foundUser = await this.usersService.findOne(user.email);

    if (foundUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = crypto
      .createHmac('sha256', process.env.APP_AUTH_SECRET)
      .update(user.password)
      .digest('hex');

    const defaultRole = await this.roleService.getDefaultRole();
    const saveUserData = {
      ...user,
      password: hashedPassword,
      role: defaultRole,
    };
    const createdUser = await this.usersService.create(saveUserData);

    return this.#getAuthOutput(createdUser);
  }

  #getAuthOutput(user: SessionUser): AuthOutput {
    return {
      data: user,
      ...this.#makeJWTTokens(user),
    };
  }

  #makeJWTTokens(payload: SessionUser) {
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
