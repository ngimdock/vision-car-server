import { ForbiddenException } from '@nestjs/common';

export class CredentialsIncorrectException extends ForbiddenException {
  constructor() {
    super('Credentials incorrect.');
  }
}
