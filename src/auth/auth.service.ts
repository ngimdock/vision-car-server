import { Inject, Injectable } from '@nestjs/common';
import { CredentialsIncorrectException } from 'src/common/exceptions';
import { EmailService } from 'src/emails/email.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserNotFoundException } from 'src/user/exceptions';
import { CreateUserData } from 'src/user/type';
import { UserService } from 'src/user/user.service';
import { hashPassword, verifyPassword } from '../common/helpers';
import { _15_MITUTES, _2_HOURS } from './constants';
import { AuthDto, ResetPasswordDto } from './dto';
import { EmailVerificationService } from './email-verification/email-verification.service';
import {
  EmailAlreadyCertified,
  EmailSendRecentlyException,
  TokenExpiredException,
} from './exceptions';
import { ForgotPasswordService } from './forgot-password/forgot-password.service';
import { UserSession, UserSessionData } from './types';
import { EVENT_EMITTER } from 'src/events/constants';
import { MyEmitter } from 'src/events/entities';
import { events } from 'src/common/constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly emailVerificationService: EmailVerificationService,
    private readonly forgotPasswordService: ForgotPasswordService,
    private readonly emailService: EmailService,
    @Inject(EVENT_EMITTER) private readonly eventEmitter: MyEmitter,
  ) {}

  async register({ email, password }: AuthDto): Promise<UserSessionData> {
    const userExist = await this.userService.findOneByEmail(email);

    if (userExist) throw new CredentialsIncorrectException();

    const hash = await hashPassword(password);

    const createUserData: CreateUserData = { email, hash };

    const sessionData = await this.userService.create(createUserData);

    this.eventEmitter.emit(events.USER_CREATED, { email });

    return sessionData;
  }

  async login({ email, password }: AuthDto): Promise<UserSessionData> {
    const foundUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!foundUser) throw new CredentialsIncorrectException();

    const isPasswordValid = await verifyPassword(foundUser.hash, password);

    if (!isPasswordValid) throw new CredentialsIncorrectException();

    return { id: foundUser.id, email: foundUser.email, role: foundUser.role };
  }

  async verifyEmail(token: string): Promise<void> {
    const emailData = await this.emailVerificationService.findOneByToken(token);

    if (!emailData) throw new UserNotFoundException();

    const timePassedWhileSendingToken = this.timePassed(
      emailData.time,
      new Date(),
    );

    if (timePassedWhileSendingToken > _2_HOURS)
      throw new TokenExpiredException();

    const user = await this.prisma.$transaction(async () => {
      const [user] = await Promise.all([
        this.userService.verifiedEmail(emailData.email),
        this.emailVerificationService.remove(emailData.email),
      ]);

      return user;
    });

    return user;
  }

  async resendEmailVerification(email: string) {
    const emailData = await this.emailVerificationService.findOneByEmail(email);

    if (!emailData) throw new EmailAlreadyCertified();

    const lastSendEmailTimePassed = this.timePassed(emailData.time, new Date());

    if (lastSendEmailTimePassed < _15_MITUTES)
      throw new EmailSendRecentlyException();

    const { token } = await this.emailVerificationService.update(email);

    await this.emailService.resendEmailVerification({ email, token });
  }

  async sendEmailToResetPassword(email: string) {
    const [userExist, userPassData] = await Promise.all([
      this.userService.findOneByEmail(email),
      this.forgotPasswordService.findOneByEmail(email),
    ]);

    if (!userExist) throw new UserNotFoundException();

    if (!userPassData) {
      const { token } = await this.forgotPasswordService.create(email);

      return this.emailService.sendEmailToResetPassword({ email, token });
    }

    const timePassedWhileSendingToken = this.timePassed(
      userPassData.time,
      new Date(),
    );

    if (timePassedWhileSendingToken < _15_MITUTES)
      throw new EmailSendRecentlyException();

    const { token } = await this.forgotPasswordService.updateToken(email);

    return this.emailService.sendEmailToResetPassword({ email, token });
  }

  async resetPassword(
    token: string,
    { newPassword }: ResetPasswordDto,
    session: UserSession,
  ) {
    const userPassData = await this.forgotPasswordService.findOneByToken(token);

    if (!userPassData) throw new UserNotFoundException();

    const { email, time } = userPassData;

    const timePassedWhileSendingToken = this.timePassed(time, new Date());

    if (timePassedWhileSendingToken > _2_HOURS)
      throw new TokenExpiredException();

    const hash = await hashPassword(newPassword);

    await this.prisma.$transaction(async () => {
      await Promise.all([
        this.userService.updatePassword(email, hash),
        this.forgotPasswordService.remove(email),
        this.emailService.sendEmailWhilePasswordReseted({ email }),
      ]);
    });

    this.destroySession(session);
  }

  destroySession(session: UserSession) {
    session.destroy((err) => {
      if (err) throw err;
    });
  }

  private timePassed(oldDate: Date, feelDate: Date) {
    const diff = Math.abs(oldDate.getTime() - feelDate.getTime());
    const diffMinutes = Math.ceil(diff / (1000 * 60));
    return diffMinutes;
  }
}
