import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { CustomerController } from './customer/customer.controller';
import { CustomerService } from './customer/customer.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [AuthModule],
  controllers: [UserController, CustomerController],
  providers: [UserService, CustomerService],
})
export class UserModule {}
