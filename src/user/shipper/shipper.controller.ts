import {
  CacheInterceptor,
  CacheKey,
  CacheTTL,
  Controller,
  Get,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from 'src/auth/decorator';
import { TWO_MINUTE } from 'src/common/constants';
import { PaginateDto } from 'src/common/dto';
import { ShipperRoute } from './enum/shipper-routes.enum';
import { ShipperService } from './shipper.service';

@Controller(ShipperRoute.shippers)
export class ShipperController {
  constructor(private readonly shipperService: ShipperService) {}

  @Roles(Role.ADMIN)
  @Get(ShipperRoute.all)
  @UseInterceptors(CacheInterceptor)
  @CacheKey(ShipperRoute.shippers)
  @CacheTTL(TWO_MINUTE)
  findAllShippers(@Query() paginate: PaginateDto) {
    return this.shipperService.findAllShippers(paginate);
  }
}
