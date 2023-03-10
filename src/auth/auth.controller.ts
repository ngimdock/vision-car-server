import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Session,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { PublicRoute } from './decorator';
import { AuthDto } from './dto';
import { AuthRoute } from './enums';
import { UserSession, UserSessionData } from './types';

@Controller(AuthRoute.auth)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @PublicRoute()
  @Post(AuthRoute.register)
  async register(@Body() authDto: AuthDto, @Session() session: UserSession) {
    const userSessionData = await this.authService.register(authDto);

    return userSessionData;

    // this.serializeSession(session, userSessionData);
  }

  @PublicRoute()
  @Post(AuthRoute.login)
  @HttpCode(HttpStatus.OK)
  async login(@Body() authDto: AuthDto, @Session() session: UserSession) {
    const userSessionData = await this.authService.login(authDto);

    this.serializeSession(session, userSessionData);
  }

  @Post(AuthRoute.logout)
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Session() session: UserSession) {
    this.authService.destroySession(session);
  }

  private serializeSession(
    session: UserSession,
    userSessionData: UserSessionData,
  ) {
    session.user = { ...userSessionData };
  }

  /**@TODO */
  @Post(AuthRoute.confirmEmail)
  async confirmEmail() {
    return { message: 'Email confirmed' };
  }

  /**@TODO */
  @Post(AuthRoute.changeEmail)
  async changeEmail() {
    return { message: 'Email changed' };
  }

  /**@TODO */
  @Post(AuthRoute.resetPassword)
  async resetPassword() {
    return { message: 'Password reset' };
  }
}
