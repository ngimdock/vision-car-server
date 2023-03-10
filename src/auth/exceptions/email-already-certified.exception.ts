import { ForbiddenException } from '@nestjs/common';

export class EmailAlreadyCertified extends ForbiddenException {
  constructor() {
    super(`This email is already certified.`);
  }
}
