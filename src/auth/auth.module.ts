import { forwardRef, Module } from '@nestjs/common';
import { EmailModule } from 'src/emails/email.module';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EmailVerificationService } from './email-verification/email-verification.service';
import { ForgotPasswordService } from './forgot-password/forgot-password.service';

@Module({
  imports: [forwardRef(() => UserModule)],
  controllers: [AuthController],
  providers: [AuthService, EmailVerificationService, ForgotPasswordService],
  exports: [AuthService],
})
export class AuthModule {}
