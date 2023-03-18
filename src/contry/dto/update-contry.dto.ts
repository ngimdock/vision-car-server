import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class UpdateContryDto {
  @IsString()
  @IsOptional()
  @MinLength(3)
  @ApiProperty()
  name: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  @ApiProperty()
  code: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  @ApiProperty()
  tax: number;
}
