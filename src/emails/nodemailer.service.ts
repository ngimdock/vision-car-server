import { Injectable } from '@nestjs/common';
import {
  getEmailToResetPasswordOptions,
  getEmailVerificationOptions,
  getEmailWelcomeOptions,
  getEmailWhilePasswodResetedOptions,
  getOrderCreatedEmailOptions,
  transporter,
} from './config';
import { EmailService } from './email.service';
import { CarOrderedEmailData, ReceiverEmailData } from './types';

@Injectable()
export class NodeMailerService implements EmailService {
  async sendEmailWelcome({
    email,
    username,
    token,
  }: ReceiverEmailData): Promise<void> {
    const options = getEmailWelcomeOptions({ email, username, token });

    await transporter.sendMail(options);
  }

  async resendEmailVerification({
    email,
    username,
    token,
  }: ReceiverEmailData): Promise<void> {
    const options = getEmailVerificationOptions({ email, username, token });

    await transporter.sendMail(options);
  }

  async sendEmailToResetPassword(
    receiverEmailData: ReceiverEmailData,
  ): Promise<void> {
    const options = getEmailToResetPasswordOptions(receiverEmailData);

    await transporter.sendMail(options);
  }

  sendEmailWhilePasswordReseted(
    receiverEmailData: ReceiverEmailData,
  ): Promise<void> {
    const options = getEmailWhilePasswodResetedOptions(receiverEmailData);

    return transporter.sendMail(options);
  }

  async sendEmailWhileOrderCreated(
    receiverEmailData: ReceiverEmailData,
    carOrderedData: CarOrderedEmailData[],
  ): Promise<void> {
    const options = getOrderCreatedEmailOptions(
      receiverEmailData,
      carOrderedData,
    );

    await transporter.sendMail(options);
  }
}
