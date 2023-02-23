import { Injectable } from '@nestjs/common';
import {
  CredentialsIncorrectException,
  CustomHttpExeption,
} from 'src/common/exceptions';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import { hashPassword, verifyPassword } from '../common/helpers';
import { UserSession, UserSessionData } from './types';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register({ email, password }: AuthDto): Promise<UserSessionData> {
    try {
      const userExist = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (userExist) throw new CredentialsIncorrectException();

      const hashedPassword = await hashPassword(password);

      const newUser = await this.prisma.user.create({
        data: {
          email,
          hash: hashedPassword,
        },
      });

      return { id: newUser.id, email: newUser.email, role: newUser.role };
    } catch (err) {
      throw new CustomHttpExeption();
    }
  }

  async login({ email, password }: AuthDto): Promise<UserSessionData> {
    try {
      const foundUser = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!foundUser) throw new CredentialsIncorrectException();

      const isPasswordValid = await verifyPassword(foundUser.hash, password);

      if (!isPasswordValid) throw new CredentialsIncorrectException();

      return { id: foundUser.id, email: foundUser.email, role: foundUser.role };
    } catch (err) {
      throw new CustomHttpExeption();
    }
  }

  destroySession(session: UserSession) {
    session.destroy((err) => {
      if (err) throw err;
    });
  }
}
