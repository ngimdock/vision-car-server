import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CheckoutSessionDto } from './dto';
import { PaymentRoute } from './enums';
import { PaymentService } from './payment.service';

@ApiTags(PaymentRoute.PAYMENT)
@Controller(PaymentRoute.PAYMENT)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post(PaymentRoute.CHECKOUT_SESSION)
  @HttpCode(HttpStatus.OK)
  checkoutSession(@Body() checkoutSessionDto: CheckoutSessionDto) {
    return this.paymentService.checkoutSession(checkoutSessionDto);
  }
}
