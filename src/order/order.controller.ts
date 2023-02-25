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
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderRoute } from './enum';

@Controller(OrderRoute.order)
export class OrderController {
  private static readonly customerId = 'customerId';
  constructor(private readonly orderService: OrderService) {}

  @Post(`${OrderRoute.create}/:${OrderController.customerId}}`)
  create(
    @Param(OrderController.customerId) customerId: string,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.orderService.create(customerId, createOrderDto);
  }

  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}
