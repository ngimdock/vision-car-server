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
  name: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  code: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  tax: number;
}
