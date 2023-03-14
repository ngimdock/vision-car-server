import { Module } from '@nestjs/common';
import { CarModule } from 'src/car/car.module';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

@Module({
  imports: [CarModule],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
