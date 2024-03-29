import { Injectable } from '@nestjs/common';
import {
  getEmailToResetPasswordOptions,
  getEmailVerificationOptions,
  getEmailWelcomeOptions,
  getEmailWhilePasswodResetedOptions,
  getNotifyAdminEmailOptions,
  getNotifyShipperEmailOptions,
  getOrderCreatedEmailOptions,
  getOrderRejectedEmailOptions,
  getOrderValidatedEmailOptions,
  transporter,
} from './config';
import { EmailService } from './email.service';
import {
  CarOrderedEmailData,
  NotifyAdminType,
  NotifyShipperType,
  ReceiverEmailData,
  ShipperEmailData,
} from './types';

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

  async sendEmailToNotifyAdmin(
    notifyAdminData: NotifyAdminType,
  ): Promise<void> {
    const options = getNotifyAdminEmailOptions(notifyAdminData);

    await transporter.sendMail(options);
  }

  sendEmailWhileOrderValidated(
    receiverEmailData: ReceiverEmailData,
    carOrderedData: CarOrderedEmailData[],
    shipperdata: ShipperEmailData,
  ): Promise<void> {
    const options = getOrderValidatedEmailOptions(
      receiverEmailData,
      carOrderedData,
      shipperdata,
    );

    return transporter.sendMail(options);
  }

  sendEmailWhileOrderRejected(
    receiverEmailData: ReceiverEmailData,
    carOrderedData: CarOrderedEmailData[],
  ): Promise<void> {
    const options = getOrderRejectedEmailOptions(
      receiverEmailData,
      carOrderedData,
    );

    return transporter.sendMail(options);
  }

  async sendEmailToNotifyShipper(
    notifyShipper: NotifyShipperType,
  ): Promise<void> {
    const options = getNotifyShipperEmailOptions(notifyShipper);

    await transporter.sendMail(options);
  }
}
