import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateCreditCardDto {
  @IsNumber()
  @IsOptional()
  @ApiProperty()
  readonly number?: number;

  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly name?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly expiry?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  readonly cvc?: number;
}
