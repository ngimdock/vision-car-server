import { Module } from '@nestjs/common';
import { CarModule } from 'src/car/car.module';
import { CreditCardModule } from 'src/credit-card/credit-card.module';
import { UserModule } from 'src/user/user.module';
import { OrderController } from './order.controller';
import { OrderRepository } from './order.repository';
import { OrderService } from './order.service';

@Module({
  imports: [UserModule, CreditCardModule, CarModule],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository],
})
export class OrderModule {}
