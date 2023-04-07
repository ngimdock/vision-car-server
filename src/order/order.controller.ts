import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { GetUserId, Roles } from 'src/auth/decorator';
import { PaginateDto } from 'src/common/dto';
import { CreateOrderDto, ShipOrderDto, ValidateOrderDto } from './dto';
import { OrderRoute } from './enum';
import { OrderService } from './order.service';
import { CustomerRoute } from 'src/user/customer/enums';

@ApiTags(OrderRoute.orders)
@Controller(OrderRoute.orders)
export class OrderController {
  private static readonly id = 'id';
  private static readonly customerId = 'customerId';

  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@GetUserId() userId: string, @Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(userId, createOrderDto);
  }

  @Roles(Role.ADMIN)
  @Get()
  findAll(@Query() paginate: PaginateDto) {
    return this.orderService.findAll(paginate);
  }

  @Get(`${CustomerRoute.customers}/:${OrderController.id}`)
  findCustomerOrders(
    @Param(OrderController.id, ParseUUIDPipe) customerId: string,
  ) {
    return this.orderService.findCustomerOrders(customerId);
  }

  @Get(`:${OrderController.id}`)
  findOne(@Param(OrderController.id) orderId: string) {
    return this.orderService.findOneById(orderId);
  }

  @Delete(`:${OrderController.id}`)
  remove(@Param(OrderController.id) orderId: string) {
    return this.orderService.remove(orderId);
  }

  @Patch(`${OrderRoute.cancel}/:${OrderController.id}`)
  cancelOrder(@Param(OrderController.id) orderId: string) {
    return this.orderService.cancelOrder(orderId);
  }

  @Patch(`${OrderRoute.resubmit}/:${OrderController.id}`)
  resubmitOrder(@Param(OrderController.id) orderId: string) {
    return this.orderService.resubmitOrder(orderId);
  }

  @Roles(Role.ADMIN)
  @Patch(`${OrderRoute.reject}/:${OrderController.id}`)
  rejectOrder(@Param(OrderController.id) orderId: string) {
    return this.orderService.rejectOrder(orderId);
  }

  @Roles(Role.ADMIN)
  @Patch(`${OrderRoute.validate}/:${OrderController.id}`)
  validateOrder(
    @Param(OrderController.id, ParseUUIDPipe) orderId: string,
    @Body() validateOrderDto: ValidateOrderDto,
  ) {
    return this.orderService.validateOrder(orderId, validateOrderDto);
  }

  @Roles(Role.SHIPPER)
  @Patch(`${OrderRoute.ship}/:${OrderController.id}`)
  shipOrder(
    @GetUserId() shipperId: string,
    @Param(OrderController.id, ParseUUIDPipe) orderId: string,
    @Body() shipOrderDto: ShipOrderDto,
  ) {
    return this.orderService.shipOrder(shipperId, orderId, shipOrderDto);
  }
}
