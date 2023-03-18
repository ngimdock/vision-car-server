import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive, IsUUID } from 'class-validator';

export class BookACarDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty()
  carId: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @ApiProperty({
    minimum: 1,
    description: 'Number of cars to book',
  })
  quantity: number;
}
