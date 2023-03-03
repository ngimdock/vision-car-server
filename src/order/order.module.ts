import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { UserModule } from 'src/user/user.module';
import { CreditCardModule } from 'src/credit-card/credit-card.module';

@Module({
  imports: [UserModule, CreditCardModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
