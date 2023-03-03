import { Injectable } from '@nestjs/common';
import { Document, DocumentType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async create(customerId: string, createOrderDto: CreateOrderDto) {
    const { bookedCars } = await this.userService.findMe(customerId);

    const allBookingIds = bookedCars.map((booking) => booking.id);

    console.log({ allBookingIds });

    return createOrderDto;
  }

  findAll() {
    return `This action returns all order`;
  }

  async findOneById(orderId: string) {
    return orderId;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
