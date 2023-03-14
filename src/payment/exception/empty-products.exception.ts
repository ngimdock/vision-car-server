import { ForbiddenException, NotFoundException } from '@nestjs/common';

export class EmptyProductException extends ForbiddenException {
  constructor() {
    super('Empty products to buy.');
  }
}
