import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class UpdateCarStockDto {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @ApiProperty({ minimum: 1 })
  quantity: number;
}
