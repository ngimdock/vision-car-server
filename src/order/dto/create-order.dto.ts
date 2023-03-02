import { PaymentRange, PaymentType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateOrderDto {
  @IsEnum([PaymentType.TOTAL_PAY, PaymentType.CREDIT_PAY])
  @IsNotEmpty()
  paymentType: PaymentType;

  @IsEnum([PaymentRange.X2, PaymentRange.X3, PaymentRange.X5])
  @IsOptional()
  paymentRange: number;

  @IsUUID()
  @IsNotEmpty()
  contry: string;
}
