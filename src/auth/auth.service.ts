import { Injectable } from '@nestjs/common';
import { CredentialsIncorrectException } from 'src/common/exceptions';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import { hashPassword, verifyPassword } from '../common/helpers';
import { UserSession, UserSessionData } from './types';
import { EmailVerificationService } from './email-verification/email-verification.service';
import { _15_MITUTES } from './constants';
import { EmailSendRecently } from './exceptions';
import { UserNotFoundException } from 'src/user/exceptions';
import { UserService } from 'src/user/user.service';
import { CreateUserData } from 'src/user/type';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly emailVerificationService: EmailVerificationService,
  ) {}

  async register({ email, password }: AuthDto): Promise<UserSessionData> {
    const userExist = await this.userService.findOneByEmail(email);

    if (userExist) throw new CredentialsIncorrectException();

    const hashedPassword = await hashPassword(password);

    const createUserData: CreateUserData = {
      email,
      hash: hashedPassword,
    };

    const sessionData = await this.userService.create(createUserData);

    await this.emailVerificationService.create(email);

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

  async changeEmailToken(email: string) {
    const emailData = await this.emailVerificationService.findOne(email);

    if (!emailData) throw new UserNotFoundException();

    const lastSendEmailMinutesPassed = this.timePassed(
      emailData.time,
      new Date(),
    );

    if (lastSendEmailMinutesPassed < _15_MITUTES) throw new EmailSendRecently();

    await this.emailVerificationService.update(email);
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
