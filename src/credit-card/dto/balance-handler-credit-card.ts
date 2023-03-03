import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class BalanceHandlerCreditCardDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  amount: number;
}
