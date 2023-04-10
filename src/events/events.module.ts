import { Global, Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EVENT_EMITTER } from './constants';
import { customEvent } from './entities';
import { EmailVerificationModule } from 'src/auth/email-verification/email-verification.module';

const eventServiceData = {
  provide: EVENT_EMITTER,
  useValue: customEvent,
};

@Global()
@Module({
  imports: [EmailVerificationModule],
  providers: [
    EventsService,
    {
      provide: EVENT_EMITTER,
      useValue: customEvent,
    },
  ],
  exports: [EVENT_EMITTER],
})
export class EventsModule {}
