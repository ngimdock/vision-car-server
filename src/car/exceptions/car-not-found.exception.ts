import { NotFoundException } from '@nestjs/common';

export class CarNotFoundException extends NotFoundException {
  constructor() {
    super('Car not found.');
  }
}
