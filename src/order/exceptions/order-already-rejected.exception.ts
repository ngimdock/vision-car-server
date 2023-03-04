import { ForbiddenException } from '@nestjs/common';

export class OrderAlreadyRejectException extends ForbiddenException {
  constructor() {
    super('Order already rejected.');
  }
}
