import { ForbiddenException } from '@nestjs/common';

export class OrderNotDellableException extends ForbiddenException {
  constructor() {
    super(
      'The order status should be "CANCELLED" or "REJECTED" before you can delete it.',
    );
  }
}
