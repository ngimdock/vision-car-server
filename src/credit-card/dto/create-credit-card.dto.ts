import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateCreditCardDto {
  @IsNumber()
  @IsNotEmpty()
  readonly number: number;

  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly expiry: string;

  @IsNumber()
  @IsNotEmpty()
  readonly cvc: number;
}
