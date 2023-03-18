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
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { PublicRoute } from './decorator';
import { AuthDto, EmailDto, ResetPasswordDto } from './dto';
import { AuthRoute } from './enums';
import { UserSession, UserSessionData } from './types';

@ApiTags(AuthRoute.auth)
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
  @HttpCode(HttpStatus.OK)
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
  @HttpCode(HttpStatus.OK)
  async sendEmailToResetPassword(@Body() emailDto: EmailDto) {
    return this.authService.sendEmailToResetPassword(emailDto.email);
  }

  @PublicRoute()
  @Post(`${AuthRoute.resetPassword}/:${AuthController.token}`)
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Param(AuthController.token) token: string,
    @Body() resetPasswordDto: ResetPasswordDto,
    @Session() session: UserSession,
  ) {
    return this.authService.resetPassword(token, resetPasswordDto, session);
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
