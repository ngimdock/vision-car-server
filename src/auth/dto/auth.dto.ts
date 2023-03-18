import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { MIN_PASSWORD_LENGTH } from '../constants';

export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: "User's email address",
  })
  email: string;

  @IsNotEmpty()
  @MinLength(MIN_PASSWORD_LENGTH)
  @ApiProperty({
    minimum: MIN_PASSWORD_LENGTH,
    description: "User's password",
  })
  password: string;
}
