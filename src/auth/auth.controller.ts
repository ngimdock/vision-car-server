import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Session,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { AuthRoute } from './enums';
import { UserSession, UserSessionData } from './types';

@Controller(AuthRoute.auth)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(AuthRoute.register)
  async register(@Body() authDto: AuthDto, @Session() session: UserSession) {
    const userSessionData = await this.authService.register(authDto);

    this.serializeSession(session, userSessionData);
  }

  @Post(AuthRoute.login)
  @HttpCode(HttpStatus.OK)
  async login(@Body() authDto: AuthDto, @Session() session: UserSession) {
    const userSessionData = await this.authService.login(authDto);

    console.log({ session });

    this.serializeSession(session, userSessionData);
  }

  private serializeSession(
    session: UserSession,
    userSessionData: UserSessionData,
  ) {
    session.user = { ...userSessionData };
  }
}
