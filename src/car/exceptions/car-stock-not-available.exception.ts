import { ForbiddenException } from '@nestjs/common';

export class CarStockNotAvailableException extends ForbiddenException {
  constructor() {
    super('Car quantity not available');
  }
}
