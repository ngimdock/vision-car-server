import { Controller, Get } from '@nestjs/common';
import { name, version } from 'package.json';

@Controller()
export class AppController {
  @Get('status')
  getStatus() {
    return {
      name,
      version,
    };
  }
}
