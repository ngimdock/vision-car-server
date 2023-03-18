import { ApiProperty } from '@nestjs/swagger';
import { PaymentRange, PaymentType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateOrderDto {
  @IsEnum([PaymentType.TOTAL_PAY, PaymentType.CREDIT_PAY])
  @IsNotEmpty()
  @ApiProperty({
    enum: [PaymentType.TOTAL_PAY, PaymentType.CREDIT_PAY],
    description: 'pay in full or in part',
  })
  paymentType: PaymentType;

  @IsEnum([PaymentRange.X2, PaymentRange.X3, PaymentRange.X5])
  @IsOptional()
  @ApiProperty({ enum: PaymentRange, description: 'payment range' })
  paymentRange: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ description: 'Country of shipment' })
  contry: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ description: 'Credit card to be charged' })
  creditCard: string;
}
