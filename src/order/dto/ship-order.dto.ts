import { IsDate, IsNotEmpty } from 'class-validator';

export class ShipOrderDto {
  @IsDate()
  @IsNotEmpty()
  shippedAt: Date;
}
