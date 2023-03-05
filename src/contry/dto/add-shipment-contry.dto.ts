import { IsNumber, IsPositive } from 'class-validator';

export class AddShipmentContryDto {
  @IsNumber()
  @IsPositive()
  price: number;
}
