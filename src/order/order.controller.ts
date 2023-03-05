import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderRoute } from './enum';
import { GetUserId } from 'src/auth/decorator';
import { CreateOrderDto } from './dto';
import { PaginateDto } from 'src/common/dto';

@Controller(OrderRoute.orders)
export class OrderController {
  private static readonly orderId = 'orderId';
  private static readonly customerId = 'customerId';

  constructor(private readonly orderService: OrderService) {}

  @Post(`${OrderRoute.create}`)
  create(@GetUserId() userId: string, @Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(userId, createOrderDto);
  }

  @Get(`${OrderRoute.all}`)
  findAll(@Query() paginate: PaginateDto) {
    return this.orderService.findAll(paginate);
  }

  @Get(`:${OrderController.customerId}`)
  findCustomerOrders(
    @Param(OrderController.customerId, ParseUUIDPipe) customerId: string,
  ) {
    return this.orderService.findCustomerOrders(customerId);
  }

  @Get(`${OrderRoute.find}/:${OrderController.orderId}`)
  findOne(@Param(OrderController.orderId) orderId: string) {
    return this.orderService.findOneById(orderId);
  }

  @Delete(`${OrderRoute.delete}/:${OrderController.orderId}`)
  remove(@Param(OrderController.orderId) orderId: string) {
    return this.orderService.remove(orderId);
  }

  @Patch(`${OrderRoute.cancel}/:${OrderController.orderId}`)
  cancelOrder(@Param(OrderController.orderId) orderId: string) {
    return this.orderService.cancelOrder(orderId);
  }

  @Patch(`${OrderRoute.resubmit}/:${OrderController.orderId}`)
  resubmitOrder(@Param(OrderController.orderId) orderId: string) {
    return this.orderService.resubmitOrder(orderId);
  }

  @Patch(`${OrderRoute.reject}/:${OrderController.orderId}`)
  rejectOrder(@Param(OrderController.orderId) orderId: string) {
    return this.orderService.rejectOrder(orderId);
  }
}
