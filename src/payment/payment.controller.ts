import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CheckoutSessionDto } from './dto';
import { PaymentRoute } from './enums';
import { PaymentService } from './payment.service';

@Controller(PaymentRoute.PAYMENT)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post(PaymentRoute.CHECKOUT_SESSION)
  @HttpCode(HttpStatus.OK)
  checkoutSession(@Body() checkoutSessionDto: CheckoutSessionDto) {
    return this.paymentService.checkoutSession(checkoutSessionDto);
  }
}
