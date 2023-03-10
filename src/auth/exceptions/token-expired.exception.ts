import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { _15_MITUTES } from '../constants';

export class TokenExpiredException extends ForbiddenException {
  constructor() {
    super(`Verification token expired.`);
  }
}
