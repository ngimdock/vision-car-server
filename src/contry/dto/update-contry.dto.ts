import {
  IsNotEmpty,
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
  name: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  code: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  tax: number;
}
