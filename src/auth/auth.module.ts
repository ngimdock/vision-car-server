import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EmailVerificationService } from './email-verification/email-verification.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, EmailVerificationService],
  exports: [AuthService],
})
export class AuthModule {}
