import { applyDecorators } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function SwaggerLoginAdminDoc() {
  return applyDecorators(
    ApiOkResponse({
      description: `Admin has successfully been retrieved.`,
    }),
    ApiNotFoundResponse({ description: 'user not found' }),
  );
}

export function SwaggerLogoutAdminDoc() {
  return applyDecorators(
    ApiOkResponse({
      description: `Admin has successfully been logout.`,
    }),
    ApiUnauthorizedResponse({ description: 'Not authotzed' }),
  );
}
