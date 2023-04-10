import { Module } from '@nestjs/common';
import { ContryService } from './contry.service';
import { ContryController } from './contry.controller';

@Module({
  controllers: [ContryController],
  providers: [ContryService],
})
export class ContryModule {}
