import { Injectable } from '@nestjs/common';
import {
  CredentialsIncorrectException,
  CustomHttpExeption,
} from 'src/common/exceptions';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import { hashPassword, verifyPassword } from '../common/helpers';
import { UserSession, UserSessionData } from './types';
import { EmailVerificationService } from './email-verification/email-verification.service';
import { _15_MITUTES, _2_HOURS } from './constants';
import {
  EmailAlreadyCertified,
  EmailSendRecentlyException,
  TokenExpiredException,
} from './exceptions';
import { UserNotFoundException } from 'src/user/exceptions';
import { UserService } from 'src/user/user.service';
import { CreateUserData } from 'src/user/type';
import { EmailService } from 'src/emails/email.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly emailVerificationService: EmailVerificationService,
    private readonly emailService: EmailService,
  ) {}

  async register({ email, password }: AuthDto): Promise<UserSessionData> {
    const userExist = await this.userService.findOneByEmail(email);

    if (userExist) throw new CredentialsIncorrectException();

    const hash = await hashPassword(password);

    const createUserData: CreateUserData = { email, hash };

    try {
      const sessionData = await this.prisma.$transaction(async () => {
        const [sessionData, { token }] = await Promise.all([
          this.userService.create(createUserData),
          this.emailVerificationService.create(email),
        ]);

        await this.emailService.sendEmailWelcome({ email, token });

        return sessionData;
      });

      return sessionData;
    } catch (err) {
      throw new CustomHttpExeption();
    }
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
