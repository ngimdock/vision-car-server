import { Controller, Get } from '@nestjs/common';
import { name, version } from 'package.json';
import { PublicRoute } from './auth/decorator';

@Controller()
export class AppController {
  // @PublicRoute()
  @Get('status')
  getStatus() {
    return {
      name,
      version,
    };
  }
}
