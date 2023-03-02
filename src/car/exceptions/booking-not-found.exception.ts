import { NotFoundException } from '@nestjs/common';

export class BookingNotFoundException extends NotFoundException {
  constructor() {
    super('Booking not found.');
  }
}
