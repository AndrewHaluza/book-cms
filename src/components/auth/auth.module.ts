import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
// import { LocalStrategy } from './strategies/local.strategy';
import { AUTH_CONSTANTS } from './constants';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: AUTH_CONSTANTS.jwt.secret,
      signOptions: { expiresIn: AUTH_CONSTANTS.jwt.expiresIn },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthController, AuthService, /* LocalStrategy ,*/ JwtStrategy],
})
export class AuthModule {}
