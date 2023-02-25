import { PaymentType } from '@prisma/client';
import { IsArray, IsEnum, IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
  @IsEnum([PaymentType.TOTAL_PAY, PaymentType.CREDIT_PAY])
  @IsNotEmpty()
  paymentType: PaymentType;

  @IsArray()
  @IsNotEmpty()
  carsToOrder: string[];
}
