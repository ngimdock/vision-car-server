import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderNotFoundException } from './exceptions';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async create(customerId: string, createOrderDto: CreateOrderDto) {
    return { customerId, createOrderDto };
  }

  findAll() {
    return `This action returns all order`;
  }

  async findOneById(orderId: string) {
    const foundOrder = await this.prisma.order.findUnique({
      where: {
        id: orderId,
      },

      include: {
        carsToOrder: {
          select: {
            brand: true,
            images: true,
            price: true,
          },
        },
      },
    });

    if (!foundOrder) throw new OrderNotFoundException();

    return foundOrder;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
