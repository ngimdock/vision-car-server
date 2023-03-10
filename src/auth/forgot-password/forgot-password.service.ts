import { Injectable } from '@nestjs/common';
import { generateSevenDigitCode } from 'src/common/helpers';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ForgotPasswordService {
  constructor(private readonly prisma: PrismaService) {}

  create(email: string) {
    const token = generateSevenDigitCode().toString();

    return this.prisma.passwordForgoten.create({
      data: { email, token },
    });
  }

  findOneByEmail(email: string) {
    return this.prisma.passwordForgoten.findUnique({
      where: { email },
    });
  }

  findOneByToken(token: string) {
    return this.prisma.passwordForgoten.findUnique({
      where: { token },
    });
  }

  updateToken(email: string) {
    const token = generateSevenDigitCode().toString();

    return this.prisma.passwordForgoten.update({
      where: { email },
      data: { token },
    });
  }

  updateEmail(email: string, newEmail: string) {
    return this.prisma.passwordForgoten.update({
      where: { email },
      data: { email: newEmail },
    });
  }

  remove(email: string) {
    return this.prisma.passwordForgoten.delete({
      where: { email },
    });
  }
}
