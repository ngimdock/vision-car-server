import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive } from 'class-validator';

export class AddShipmentContryDto {
  @IsNumber()
  @IsPositive()
  @ApiProperty({
    minimum: 1,
    description: 'The price of the service for this country',
  })
  price: number;
}
