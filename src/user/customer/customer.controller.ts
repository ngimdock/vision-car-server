import {
  CacheInterceptor,
  CacheKey,
  CacheTTL,
  Controller,
  Get,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from 'src/auth/decorator';
import { TWO_MINUTE } from 'src/common/constants';
import { PaginateDto } from 'src/common/dto';
import { CustomerService } from './customer.service';
import { CustomerRoute } from './enums';

@ApiTags(CustomerRoute.customers)
@Controller(CustomerRoute.customers)
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Roles(Role.ADMIN)
  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheKey(CustomerRoute.customers)
  @CacheTTL(TWO_MINUTE)
  findAllCustomers(@Query() paginate: PaginateDto) {
    return this.customerService.findAllCustomers(paginate);
  }
}
