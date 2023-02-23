import {
  CacheInterceptor,
  CacheKey,
  CacheTTL,
  Controller,
  Get,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { TWO_MINUTE } from 'src/common/constants';
import { PaginateDto } from 'src/common/dto';
import { CustomerService } from './customer.service';
import { CustomerRoute } from './enums';

@Controller(CustomerRoute.customers)
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get(CustomerRoute.all)
  @UseInterceptors(CacheInterceptor)
  @CacheKey(CustomerRoute.customers)
  @CacheTTL(TWO_MINUTE)
  findAllCustomers(@Query() paginate: PaginateDto) {
    return this.customerService.findAllCustomers(paginate);
  }
}
