import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EmailVerificationService {
  constructor(private readonly prisma: PrismaService) {}

  findOne(email: string) {
    return this.prisma.emailVerification.findUnique({
      where: { email },
    });
  }

  async create(email: string) {
    const token = this.generateSevenDigitCode().toString();

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
    const token = this.generateSevenDigitCode().toString();

    return this.prisma.emailVerification.update({
      where: { email },
      data: { token },
    });
  }

  private generateSevenDigitCode() {
    return Math.floor(1000000 + Math.random() * 9000000);
  }
}
