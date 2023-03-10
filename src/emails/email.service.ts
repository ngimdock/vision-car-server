import { Injectable } from '@nestjs/common';
import { ReceiverEmailData } from './types';

@Injectable()
export abstract class EmailService {
  abstract sendEmailWelcome(receiverEmailData: ReceiverEmailData): Promise<any>;

  abstract sendEmailVerification(
    receieverEmail: string,
    token: string,
  ): Promise<any>;
}
