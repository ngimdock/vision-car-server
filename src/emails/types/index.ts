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
