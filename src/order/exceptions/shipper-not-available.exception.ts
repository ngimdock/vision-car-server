import { ForbiddenException } from '@nestjs/common';

export class ShipperNotAvailableException extends ForbiddenException {
  constructor() {
    super('The shipper is not available.');
  }
}
