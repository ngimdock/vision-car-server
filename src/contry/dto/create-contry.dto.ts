import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateContryDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty()
  name: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @ApiProperty()
  code: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @ApiProperty()
  tax: number;
}
