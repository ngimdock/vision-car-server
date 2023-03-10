import { Injectable } from '@nestjs/common';
import {
  getEmailVerificationOptions,
  getEmailWelcomeOptions,
  transporter,
} from './config';
import { EmailService } from './email.service';
import { ReceiverEmailData } from './types';

@Injectable()
export class NodeMailerService implements EmailService {
  async sendEmailWelcome({
    email,
    username,
    token,
  }: ReceiverEmailData): Promise<void> {
    const options = getEmailWelcomeOptions({ email, username, token });

    // const transporter = await getTransporter();

    return transporter.sendMail(options);
  }

  async sendEmailVerification(
    receieverEmail: string,
    token: string,
  ): Promise<void> {
    const options = getEmailVerificationOptions(receieverEmail, token);

    // const transporter = await getTransporter();

    return transporter.sendMail(options);
  }
}
