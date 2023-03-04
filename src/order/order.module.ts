import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { UserModule } from 'src/user/user.module';
import { CreditCardModule } from 'src/credit-card/credit-card.module';
import { CarModule } from 'src/car/car.module';
import { OrderRepository } from './order.repository';

@Module({
  imports: [UserModule, CreditCardModule, CarModule],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository],
})
export class OrderModule {}
