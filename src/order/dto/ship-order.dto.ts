import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty } from 'class-validator';

export class ShipOrderDto {
  @IsDate()
  @IsNotEmpty()
  @ApiProperty({ description: 'Provide the current date' })
  shippedAt: Date;
}
