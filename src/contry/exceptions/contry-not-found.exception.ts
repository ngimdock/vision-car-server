import { NotFoundException } from '@nestjs/common';

export class ContryNotFoundException extends NotFoundException {
  constructor() {
    super('Contry not found.');
  }
}
