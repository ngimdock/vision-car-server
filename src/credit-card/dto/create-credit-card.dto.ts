import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ description: 'The credit card number' })
  readonly number: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'The credit card name' })
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'The expiry date' })
  readonly expiry: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @ApiProperty()
  readonly cvc: number;

  @IsNumber()
  @IsOptional()
  @IsPositive()
  @ApiProperty({ description: 'The initial balance' })
  readonly balance: number;
}
