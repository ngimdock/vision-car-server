import { Car } from '@prisma/client';

export interface EmailOptionsType {
  from: string;
  to: string;
  subject: string;
  text?: string;
  html: string;
}

export type ReceiverEmailData = {
  email: string;
  username?: string;
  token?: string;
};

export type CarOrderedEmailData = Pick<Car, 'brand' | 'price'> & {
  quantity: number;
};

export interface NotifyAdminType {
  subject: string;
  message: string;
}
