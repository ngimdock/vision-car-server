import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateCarDto {
  @IsString()
  @IsNotEmpty()
  readonly brand: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(100)
  readonly description: string;

  @IsNotEmpty()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  readonly images: string[];

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  readonly availableStock: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  readonly price: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  readonly reductionPercent: number;
}
