import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { AuthRoute } from './enums';

@Controller(AuthRoute.auth)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(AuthRoute.register)
  async register(@Body() authDto: AuthDto) {
    return this.authService.register(authDto);
  }

  @Post(AuthRoute.login)
  async login(@Body() authDto: AuthDto) {
    return this.authService.login(authDto);
  }
}
