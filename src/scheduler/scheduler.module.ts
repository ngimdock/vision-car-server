import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CarModule } from 'src/car/car.module';
import { SchedulerService } from './scheduler.service';

@Module({
  imports: [ScheduleModule.forRoot(), CarModule],
  providers: [SchedulerService],
})
export class SchedulerModule {}
