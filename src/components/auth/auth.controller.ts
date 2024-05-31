import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInInput } from './dto/sign-in.input';
import { SignUpInput } from './dto/sign-up.input';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller({ path: 'auth' })
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  async signIn(@Body() signInInput: SignInInput, @Request() req) {
    return this.authService.signIn(req.user);
  }

  @Post('sign-up')
  async signUp(@Body() signUpInput: SignUpInput) {
    return this.authService.signUp(signUpInput);
  }
}
