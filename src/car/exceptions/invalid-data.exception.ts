import { BadRequestException } from '@nestjs/common';

export class InvalidDataException extends BadRequestException {
  constructor() {
    super('Invalid data provided.');
  }
}
