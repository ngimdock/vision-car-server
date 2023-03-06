import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class UpdateCarStockDto {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  quantity: number;
}
