import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { CustomerController } from './customer/customer.controller';
import { CustomerService } from './customer/customer.service';
import { ShipperController } from './shipper/shipper.controller';
import { ShipperService } from './shipper/shipper.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [UserController, CustomerController, ShipperController],
  providers: [UserService, CustomerService, ShipperService],
  exports: [UserService, ShipperService],
})
export class UserModule {}
