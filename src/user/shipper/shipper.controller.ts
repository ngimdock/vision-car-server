import { Controller, Get, Query } from '@nestjs/common';
import { PaginateDto } from 'src/common/dto';
import { ShipperRoute } from './enum/shipper-routes.enum';
import { ShipperService } from './shipper.service';

@Controller(ShipperRoute.shippers)
export class ShipperController {
  constructor(private readonly shipperService: ShipperService) {}

  @Get(ShipperRoute.all)
  findAllShippers(@Query() paginate: PaginateDto) {
    return this.shipperService.findAllShippers(paginate);
  }
}
