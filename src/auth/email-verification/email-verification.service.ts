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

  create(email: string, token: string) {
    return this.prisma.emailVerification.create({
      data: { email, token },
    });
  }

  remove(email: string) {
    return this.prisma.emailVerification.delete({
      where: { email },
    });
  }

  update(email: string, token: string) {
    return this.prisma.emailVerification.update({
      where: { email },
      data: { token },
    });
  }
}
