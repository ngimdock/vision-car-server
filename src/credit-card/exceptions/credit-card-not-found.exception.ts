import { NotFoundException } from '@nestjs/common';

export class CreditCardNotFoundException extends NotFoundException {
  constructor() {
    super('Credit card not found.');
  }
}
