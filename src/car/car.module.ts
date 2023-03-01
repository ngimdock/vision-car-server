import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { CarController } from './car.controller';
import { CarRepository } from './car.repository';
import { CarService } from './car.service';

@Module({
  imports: [UserModule],
  controllers: [CarController],
  providers: [CarService, CarRepository],
})
export class CarModule {}
