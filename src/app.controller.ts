import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { name, version } from 'package.json';
import { PublicRoute } from './auth/decorator';

@ApiTags('Status')
@Controller()
export class AppController {
  @PublicRoute()
  @Get('status')
  getStatus() {
    return {
      name,
      version,
    };
  }
}
