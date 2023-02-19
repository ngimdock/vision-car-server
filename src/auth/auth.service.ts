import { Injectable } from '@nestjs/common';
import { AuthDto } from './dto';

@Injectable()
export class AuthService {
  async register(authDto: AuthDto) {
    return authDto;
  }
  async login(authDto: AuthDto) {
    return authDto;
  }
}
