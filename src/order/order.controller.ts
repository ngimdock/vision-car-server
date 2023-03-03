import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { UpdateOrderDto } from './dto/update-order.dto';
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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(+id, updateOrderDto);
  }

  @Delete(`${OrderRoute.delete}/:${OrderController.orderId}`)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param(OrderController.orderId) orderId: string) {
    return this.orderService.remove(orderId);
  }
}
