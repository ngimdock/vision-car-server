import { ForbiddenException } from '@nestjs/common';

export class EmptyBookingsException extends ForbiddenException {
  constructor() {
    super('Make sure to book product before order.');
  }
}
