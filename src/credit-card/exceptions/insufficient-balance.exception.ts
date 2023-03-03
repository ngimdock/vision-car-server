import { ForbiddenException } from '@nestjs/common';

export class InsufficientBalanceException extends ForbiddenException {
  constructor() {
    super('Insufficient balance.');
  }
}
