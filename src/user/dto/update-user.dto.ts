import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsLowercase, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @MinLength(4)
  @IsLowercase()
  @ApiProperty({ required: false })
  username?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  name?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  avatar?: string;
}
