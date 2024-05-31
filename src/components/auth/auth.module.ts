import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
// import { LocalStrategy } from './strategies/local.strategy';
import { RoleModule } from '../role/role.module';
import { AuthController } from './auth.controller';
import { AUTH_CONSTANTS } from './constants';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    RoleModule,
    JwtModule.register({
      secret: AUTH_CONSTANTS.jwt.secret,
      signOptions: { expiresIn: AUTH_CONSTANTS.jwt.expiresIn },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthController, AuthService, /* LocalStrategy ,*/ JwtStrategy],
})
export class AuthModule {}
