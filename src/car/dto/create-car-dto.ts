import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateCarDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly brand: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(100)
  @MaxLength(1000)
  @ApiProperty({
    minimum: 100,
    maximum: 1000,
  })
  readonly description: string;

  @IsNotEmpty()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @ApiProperty({ type: [String] })
  readonly images: string[];

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @ApiProperty({ minimum: 1 })
  readonly availableStock: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @ApiProperty({ minimum: 1 })
  readonly price: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @ApiProperty({
    minimum: 1,
    description: 'The reduction to be applied in case of bad sales',
  })
  readonly reductionPercent: number;
}
