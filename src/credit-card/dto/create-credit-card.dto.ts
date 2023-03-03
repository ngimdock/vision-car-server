import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateCreditCardDto {
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  readonly number: number;

  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly expiry: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  readonly cvc: number;

  @IsNumber()
  @IsOptional()
  @IsPositive()
  readonly balance: number;
}
