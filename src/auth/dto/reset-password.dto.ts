import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';
import { MIN_PASSWORD_LENGTH } from '../constants';

export class ResetPasswordDto {
  @IsNotEmpty()
  @MinLength(MIN_PASSWORD_LENGTH)
  @ApiProperty({
    minimum: MIN_PASSWORD_LENGTH,
    description: "User's password",
  })
  newPassword: string;
}
