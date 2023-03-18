import { applyDecorators } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { _15_MITUTES } from '../constants';

export function SwaggerRegisterDoc() {
  return applyDecorators(
    ApiCreatedResponse({
      description: `User has successfully been registered.`,
    }),
  );
}

export function SwaggerLoginDoc() {
  return applyDecorators(
    ApiOkResponse({
      description: `User has successfully been logged.`,
    }),
    ApiNotFoundResponse({ description: 'user not found' }),
    ApiForbiddenResponse({ description: 'password invalid' }),
  );
}

export function SwaggerLogoutDoc() {
  return applyDecorators(
    ApiNoContentResponse({
      description: `User has successfully been logout.`,
    }),
    ApiUnauthorizedResponse({ description: 'Not authorized' }),
  );
}

export function SwaggerResendEmailVerificationDoc() {
  return applyDecorators(
    ApiForbiddenResponse({
      description: 'This email is already certified.',
    }),

    ApiForbiddenResponse({
      description: `Email send recently, use it or wait ${_15_MITUTES} minutes.`,
    }),

    ApiUnauthorizedResponse({ description: 'Not authorized' }),
  );
}

export function SwaggerVerifyEmailDoc() {
  return applyDecorators(
    ApiNotFoundResponse({
      description: 'User not found',
    }),

    ApiForbiddenResponse({
      description: `Verification token expired.`,
    }),
  );
}

export function SwaggerSendEmailToResetPasswordDoc() {
  return applyDecorators(
    ApiNotFoundResponse({
      description: 'User not found',
    }),

    ApiForbiddenResponse({
      description: `Email send recently, use it or wait ${_15_MITUTES} minutes.`,
    }),

    ApiUnauthorizedResponse({ description: 'Not authorized' }),
  );
}

export function SwaggerResetPasswordDoc() {
  return applyDecorators(
    ApiNotFoundResponse({
      description: 'User not found',
    }),

    ApiForbiddenResponse({
      description: `Verification token expired.`,
    }),
  );
}
