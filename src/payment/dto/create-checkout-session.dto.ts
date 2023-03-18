import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ description: 'Product id' })
  id: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @ApiProperty()
  quantity: number;
}

export class CheckoutSessionDto {
  @IsNotEmpty()
  @Type(() => ProductToBuy)
  @ValidateNested({ each: true })
  @ApiProperty({ type: [ProductToBuy] })
  products: ProductToBuy[];

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The redirection link after a successful payment',
  })
  successUrl: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The redirection link after a cancelled payment',
  })
  cancelUrl: string;
}
