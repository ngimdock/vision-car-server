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
  ParseUUIDPipe,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderRoute } from './enum';

@Controller(OrderRoute.orders)
export class OrderController {
  private static readonly customerId = 'customerId';
  private static readonly orderId = 'orderId';

  constructor(private readonly orderService: OrderService) {}

  @Post(`${OrderRoute.create}/:${OrderController.customerId}`)
  create(
    @Param(OrderController.customerId, ParseUUIDPipe) customerId: string,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.orderService.create(customerId, createOrderDto);
  }

  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @Get(`${OrderRoute.find}/:${OrderController.orderId}`)
  findOne(@Param(OrderController.orderId) orderId: string) {
    return this.orderService.findOneById(orderId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}
