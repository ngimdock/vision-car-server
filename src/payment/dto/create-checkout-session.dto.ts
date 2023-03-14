import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class ProductToBuy {
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  quantity: number;
}

export class CheckoutSessionDto {
  @IsNotEmpty()
  @Type(() => ProductToBuy)
  @ValidateNested({ each: true })
  products: ProductToBuy[];

  @IsString()
  @IsNotEmpty()
  successUrl: string;

  @IsString()
  @IsNotEmpty()
  cancelUrl: string;
}
