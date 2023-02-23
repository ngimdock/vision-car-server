import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Max } from 'class-validator';
export class PaginateDto {
  @IsNumber()
  @IsOptional()
  @Max(1000)
  @Type(() => Number)
  readonly offset?: number = 0;

  @IsNumber()
  @IsOptional()
  @Max(20)
  @Type(() => Number)
  readonly limit?: number = 20;
}
