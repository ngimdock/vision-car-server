import { IsNotEmpty, IsNumber, IsPositive, IsUUID } from 'class-validator';

export class BookACarDto {
  @IsUUID()
  @IsNotEmpty()
  carId: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  quantity: number;
}
