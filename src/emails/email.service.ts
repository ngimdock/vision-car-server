import { Injectable } from '@nestjs/common';
import {
  CarOrderedEmailData,
  NotifyAdminType,
  ReceiverEmailData,
} from './types';

@Injectable()
export abstract class EmailService {
  abstract sendEmailWelcome(
    receiverEmailData: ReceiverEmailData,
  ): Promise<void>;

  abstract resendEmailVerification(
    receiverEmailData: ReceiverEmailData,
  ): Promise<void>;

  abstract sendEmailToResetPassword(
    receiverEmailData: ReceiverEmailData,
  ): Promise<void>;

  abstract sendEmailWhilePasswordReseted(
    receiverEmailData: ReceiverEmailData,
  ): Promise<void>;

  abstract sendEmailWhileOrderCreated(
    receiverEmailData: ReceiverEmailData,
    carOrderedData: CarOrderedEmailData[],
  ): Promise<void>;

  abstract sendEmailToNotifyAdmin(
    notifyAdminData: NotifyAdminType,
  ): Promise<void>;
}
