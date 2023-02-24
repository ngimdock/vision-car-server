import { ForbiddenException } from '@nestjs/common';

export class CarStockFinishedException extends ForbiddenException {
  constructor() {
    super("Car's stock is finished");
  }
}
