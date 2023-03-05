import { DocumentType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class DocumentDataType {
  @IsEnum([
    DocumentType.CERTIFICATE,
    DocumentType.IMMATRICULATION,
    DocumentType.PURCHASE_FORM,
  ])
  @IsNotEmpty()
  type: 'CERTIFICATE' | 'IMMATRICULATION' | 'PURCHASE_FORM';

  @IsString()
  @IsOptional()
  note?: string;

  @IsString()
  @IsNotEmpty()
  file: string;
}

export class ValidateOrderDto {
  @Type(() => DocumentDataType)
  @ValidateNested({ each: true })
  documents: DocumentDataType[];

  @IsDate()
  @IsNotEmpty()
  validatedAt: Date;
}
