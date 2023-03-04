import { ForbiddenException } from '@nestjs/common';

export class OrderAlreadyCancelException extends ForbiddenException {
  constructor() {
    super('Order already canceled.');
  }
}
