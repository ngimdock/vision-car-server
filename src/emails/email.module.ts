import { Global, Module } from '@nestjs/common';
import { NodeMailerService } from './nodemailer.service';
import { EmailService } from './email.service';

@Global()
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
