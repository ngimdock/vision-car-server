import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Session,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { PublicRoute } from './decorator';
import { AuthDto, EmailDto } from './dto';
import { AuthRoute } from './enums';
import { UserSession, UserSessionData } from './types';

@Controller(AuthRoute.auth)
export class AuthController {
  private static readonly token = 'token';

  constructor(private readonly authService: AuthService) {}

  @PublicRoute()
  @Post(AuthRoute.register)
  async register(@Body() authDto: AuthDto, @Session() session: UserSession) {
    const userSessionData = await this.authService.register(authDto);

    this.serializeSession(session, userSessionData);
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

  @PublicRoute()
  @Post(AuthRoute.resendEmailVerification)
  async resendEmailVerification(@Body() emailDto: EmailDto) {
    return this.authService.resendEmailVerification(emailDto.email);
  }

  @PublicRoute()
  @Get(`${AuthRoute.verifyEmail}/:${AuthController.token}`)
  async verifyEmail(@Param(AuthController.token) token: string) {
    return this.authService.verifyEmail(token);
  }

  @PublicRoute()
  @Post(AuthRoute.sendEmailToResetPassword)
  async sendEmailToResetPassword(@Body() emailDto: EmailDto) {
    return this.authService.sendEmailToResetPassword(emailDto.email);
  }

  @PublicRoute()
  @Get(`${AuthRoute.resetPassword}/:${AuthController.token}`)
  async resetPassword(@Param(AuthController.token) token: string) {
    return { message: 'Password reset', token };
  }

  /**@TODO */
  @Post(AuthRoute.changeEmail)
  async changeEmail() {
    return { message: 'Email changed' };
  }

  private serializeSession(
    session: UserSession,
    userSessionData: UserSessionData,
  ) {
    session.user = { ...userSessionData };
  }
}
