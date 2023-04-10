import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { EVENT_EMITTER } from './constants';
import { MyEmitter } from './entities';
import { events } from 'src/common/constants';
import { EmailService } from 'src/emails/email.service';
import { EmailVerificationService } from 'src/auth/email-verification/email-verification.service';

@Injectable()
export class EventsService implements OnModuleInit {
  constructor(
    private readonly emailService: EmailService,
    private readonly emailVerificationService: EmailVerificationService,
    @Inject(EVENT_EMITTER) private readonly event: MyEmitter,
  ) {}

  onModuleInit() {
    this.event.on(
      events.USER_CREATED,
      async (userCreatedData: { email: string }) => {
        const { token } = await this.emailVerificationService.create(
          userCreatedData.email,
        );

        this.emailService.sendEmailWelcome({
          email: userCreatedData.email,
          token,
        });
      },
    );
  }
}
