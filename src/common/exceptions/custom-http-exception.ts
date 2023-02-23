import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomHttpExeption extends HttpException {
  constructor() {
    super('An error occured', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
