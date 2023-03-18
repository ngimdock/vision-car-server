import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, Max } from 'class-validator';
import { MAX_CARS_TO_FETCH, MAX_OFFSET, MIN_OFFSET } from '../constants';
export class PaginateDto {
  @IsNumber()
  @IsOptional()
  @Max(MAX_OFFSET)
  @Type(() => Number)
  @ApiProperty({
    default: MIN_OFFSET,
    minimum: MIN_OFFSET,
    maximum: MAX_OFFSET,
  })
  readonly offset?: number = MIN_OFFSET;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Max(MAX_CARS_TO_FETCH)
  @Type(() => Number)
  @ApiProperty({
    default: MAX_CARS_TO_FETCH,
    minimum: 1,
    maximum: MAX_CARS_TO_FETCH,
  })
  readonly limit?: number = MAX_CARS_TO_FETCH;
}
