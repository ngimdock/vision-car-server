import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class BalanceHandlerCreditCardDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @ApiProperty({
    default: 100,
  })
  amount: number;
}
