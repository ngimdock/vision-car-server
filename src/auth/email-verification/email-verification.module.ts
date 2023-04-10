import { Module } from '@nestjs/common';
import { EmailVerificationService } from './email-verification.service';

@Module({
  providers: [EmailVerificationService],
  exports: [EmailVerificationService],
})
export class EmailVerificationModule {}
