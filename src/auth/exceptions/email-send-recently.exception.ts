import { NotFoundException } from '@nestjs/common';
import { _15_MITUTES } from '../constants';

export class EmailSendRecently extends NotFoundException {
  constructor() {
    super(`Email send recently, use it or wait ${_15_MITUTES} minutes.`);
  }
}
