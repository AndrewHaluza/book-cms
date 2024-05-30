import { Controller, Request, Post, UseGuards, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { SignInInput } from './dto/sign-in.input';
import { SignUpInput } from './dto/sign-up.input';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/sign-in')
  async signIn(@Body() signInInput: SignInInput, @Request() req) {
    return this.authService.signIn(req.user);
  }

  @Post('auth/sign-up')
  async signUp(@Body() signUpInput: SignUpInput) {
    return this.authService.signUp(signUpInput);
  }
}
