import { Module } from '@nestjs/common';
import { NodeMailerService } from './nodemailer.service';
import { EmailService } from './email.service';

@Module({
  providers: [
    {
      provide: EmailService,
      useClass: NodeMailerService,
    },
  ],
  exports: [EmailService],
})
export class EmailModule {}
