import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateCreditCardDto {
  @IsNumber()
  @IsOptional()
  readonly number?: number;

  @IsString()
  @IsOptional()
  readonly name?: string;

  @IsString()
  @IsOptional()
  readonly expiry?: string;

  @IsNumber()
  @IsOptional()
  readonly cvc?: number;
}
