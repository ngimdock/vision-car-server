import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
import * as Mailgen from 'mailgen';
import { EmailOptionsType, ReceiverEmailData } from './types';

dotenv.config();

const COMPANY_NAME = process.env.COMPANY_NAME;
const COMPANY_EMAIL = process.env.COMPANY_EMAIL;
const COMPANY_EMAIL_PASSWORD = process.env.COMPANY_EMAIL_PASSWORD;

const SERVER_APP_HOST = process.env.SERVER_APP_HOST;
const SERVER_APP_PORT = process.env.SERVER_APP_PORT;

console.log({
  COMPANY_NAME,
  COMPANY_EMAIL,
  COMPANY_EMAIL_PASSWORD,
  SERVER_APP_HOST,
  SERVER_APP_PORT,
});

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: COMPANY_EMAIL,
    pass: COMPANY_EMAIL_PASSWORD,
  },
});

const MailGenerator = new Mailgen({
  theme: 'default',
  product: {
    name: 'Mailgen',
    link: 'https://mailgen.js/',
  },
});

export const getEmailWelcomeOptions = ({
  email,
  username,
  token,
}: ReceiverEmailData): EmailOptionsType => {
  const template = {
    body: {
      name: username || 'there',
      intro: `Welcome to ${COMPANY_NAME} We're very excited to have you on board.`,
      action: {
        instructions: `To get started with ${COMPANY_NAME} , please click here:`,
        button: {
          color: '#22BC66',
          text: 'Confirm your account',
          link: `${SERVER_APP_HOST}:${SERVER_APP_PORT}/auth/email/verify/${token}`,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };

  const welcomeEmailTemplate = MailGenerator.generate(template);

  return {
    from: COMPANY_EMAIL,
    to: email,
    subject: `Welcome to ${COMPANY_NAME}`,
    html: welcomeEmailTemplate,
  };
};

export const getEmailVerificationOptions = (
  receieverEmail: string,
  token: string,
): EmailOptionsType => ({
  from: '<ngimdockzemfack@gmail.com>',
  to: receieverEmail,
  subject: 'Verify your email',
  text: 'Hello verify your email by clicking on the link below',
  html: `Hi! <br><br> This is the link.<br><br>
    <a href='http://localhost:3333/auth/email/verify/${token}'>Click here to activate your account</a>`,
});
