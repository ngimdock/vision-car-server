import { ApiProperty } from '@nestjs/swagger';
import { DocumentType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

class DocumentDataType {
  @IsEnum([
    DocumentType.CERTIFICATE,
    DocumentType.IMMATRICULATION,
    DocumentType.PURCHASE_FORM,
  ])
  @IsNotEmpty()
  @ApiProperty({ enum: DocumentType })
  type: 'CERTIFICATE' | 'IMMATRICULATION' | 'PURCHASE_FORM';

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  note?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  file: string;
}

export class ValidateOrderDto {
  @Type(() => DocumentDataType)
  @ValidateNested({ each: true })
  @ApiProperty({ type: [DocumentDataType], description: 'Order documents' })
  documents: DocumentDataType[];

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ description: 'Shipper id' })
  shipper: string;

  @IsDate()
  @IsNotEmpty()
  @ApiProperty({ description: 'Provide the current date' })
  validatedAt: Date;
}
