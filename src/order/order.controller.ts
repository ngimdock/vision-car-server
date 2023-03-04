import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderRoute } from './enum';
import { GetUserId } from 'src/auth/decorator';
import { CreateOrderDto } from './dto';

@Controller(OrderRoute.orders)
export class OrderController {
  private static readonly customerId = 'customerId';
  private static readonly orderId = 'orderId';

  constructor(private readonly orderService: OrderService) {}

  @Post(`${OrderRoute.create}`)
  create(@GetUserId() userId: string, @Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(userId, createOrderDto);
  }

  @Get()
  findAll(@GetUserId() customerId: string) {
    return this.orderService.findAll(customerId);
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
}
