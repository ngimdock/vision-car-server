import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
import * as Mailgen from 'mailgen';
import {
  CarOrderedEmailData,
  EmailOptionsType,
  NotifyAdminType,
  ReceiverEmailData,
} from './types';
import { AuthRoute } from 'src/auth/enums';

dotenv.config();

const COMPANY_NAME = process.env.COMPANY_NAME;
const COMPANY_EMAIL = process.env.COMPANY_EMAIL;
const COMPANY_EMAIL_PASSWORD = process.env.COMPANY_EMAIL_PASSWORD;

const NGIMDOCK_LINKEDIN = process.env.NGIMDOCK_LINKEDIN;

const SERVER_APP_HOST = process.env.SERVER_APP_HOST;
const SERVER_APP_PORT = process.env.SERVER_APP_PORT;

const CLIENT_APP_URL = process.env.CLIENT_APP_URL;

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
    name: COMPANY_NAME,
    link: NGIMDOCK_LINKEDIN,
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
      outro: `Need help, or have questions? Just reply to this email, we'd love to help.


              ${COMPANY_NAME} Team.
            `,
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

export const getEmailVerificationOptions = ({
  email,
  username,
  token,
}: ReceiverEmailData): EmailOptionsType => {
  const template = {
    body: {
      name: username || '',
      intro: `To ensure that you receive all important updates and information related to our services, we need to verify your email account.`,
      action: {
        instructions: `Please click on the verification link provided below to complete the process:`,
        button: {
          color: '#22BC66',
          text: 'Verify your email',
          link: `${SERVER_APP_HOST}:${SERVER_APP_PORT}/auth/email/verify/${token}`,
        },
      },
      outro: `Need help, or have questions? Just reply to this email, we'd love to help.


              ${COMPANY_NAME} Team.
            `,
    },
  };

  const welcomeEmailTemplate = MailGenerator.generate(template);

  return {
    from: COMPANY_EMAIL,
    to: email,
    subject: `Please Verify Your Email Account`,
    html: welcomeEmailTemplate,
  };
};

export const getEmailToResetPasswordOptions = ({
  email,
  username,
  token,
}: ReceiverEmailData): EmailOptionsType => {
  const template = {
    body: {
      name: username || '',
      intro: `Click on this button to reset your password.`,
      action: {
        instructions: `This reset password link will expire in 2 hour.`,
        button: {
          color: '#22BC66',
          text: 'Reset your password',
          link: `${SERVER_APP_HOST}:${SERVER_APP_PORT}/${AuthRoute.auth}/${AuthRoute.resetPassword}/${token}`,
        },
      },
      outro: `Need help, or have questions? Just reply to this email, we'd love to help.


              ${COMPANY_NAME} Team.
            `,
    },
  };

  const welcomeEmailTemplate = MailGenerator.generate(template);

  return {
    from: COMPANY_EMAIL,
    to: email,
    subject: `Reset your password`,
    html: welcomeEmailTemplate,
  };
};

export const getEmailWhilePasswodResetedOptions = ({
  email,
  username,
}: ReceiverEmailData): EmailOptionsType => {
  const template = {
    body: {
      name: username || '',
      intro: `Your password has been reset successfully, use your new password to login.`,
      action: {
        instructions: `If you did this action, you can safely ignore this email. Otherwise, contact us immediately.`,
        button: {
          color: '#22BC66',
          text: 'The login page',
          link: `${SERVER_APP_HOST}:${SERVER_APP_PORT}/${AuthRoute.auth}/${AuthRoute.login}`,
        },
      },
      outro: `Need help, or have questions? Just reply to this email, we'd love to help.


              ${COMPANY_NAME} Team.
            `,
    },
  };

  const welcomeEmailTemplate = MailGenerator.generate(template);

  return {
    from: COMPANY_EMAIL,
    to: email,
    subject: `Your password has been reset`,
    html: welcomeEmailTemplate,
  };
};

export const getOrderCreatedEmailOptions = (
  { email }: ReceiverEmailData,
  carOrderedData: CarOrderedEmailData[],
) => {
  const template = {
    body: {
      intro:
        'We are currently processing your order, after validation, our team will send you the delivery informations.',

      table: {
        data: carOrderedData.map((car) => ({
          cars: car.brand,
          quantity: car.quantity,
          price: '$' + car.price * car.quantity,
        })),

        customWidth: {
          item: '20%',
          price: '15%',
        },

        customAlignment: {
          price: 'right',
        },
      },

      outro: `Need help, or have questions? Just reply to this email, we'd love to help.


              ${COMPANY_NAME} Team.
            `,
    },
  };

  const welcomeEmailTemplate = MailGenerator.generate(template);

  return {
    from: COMPANY_EMAIL,
    to: email,
    subject: `Your order has been created`,
    html: welcomeEmailTemplate,
  };
};

export const getNotifyAdminEmailOptions = ({
  subject,
  message,
}: NotifyAdminType) => {
  const template = {
    body: {
      intro: message,
      action: {
        instructions: `Consult your dashboard for more details`,
        button: {
          color: '#22BC66',
          text: 'Your dashboard',
          link: `${CLIENT_APP_URL}/admin/dashboard`,
        },
      },
    },
  };

  const emailTemplate = MailGenerator.generate(template);

  return {
    from: COMPANY_EMAIL,
    to: COMPANY_EMAIL,
    subject: subject,
    html: emailTemplate,
  };
};
