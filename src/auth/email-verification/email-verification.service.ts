import { Injectable } from '@nestjs/common';
import { generateSevenDigitCode } from 'src/common/helpers';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EmailVerificationService {
  constructor(private readonly prisma: PrismaService) {}

  findOneByEmail(email: string) {
    return this.prisma.emailVerification.findUnique({
      where: { email },
    });
  }

  findOneByToken(token: string) {
    return this.prisma.emailVerification.findUnique({
      where: { token },
    });
  }

  async create(email: string) {
    const token = generateSevenDigitCode().toString();

    return this.prisma.emailVerification.create({
      data: { email, token },
    });
  }

  remove(email: string) {
    return this.prisma.emailVerification.delete({
      where: { email },
    });
  }

  update(email: string) {
    const token = generateSevenDigitCode().toString();

    return this.prisma.emailVerification.update({
      where: { email },
      data: { token },
    });
  }
}
