import { ForbiddenException, Injectable } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  cancelOrder(orderId: string) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.CANCELLED },
    });
  }

  resubmitOrder(orderId: string) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.PENDING },
    });
  }

  rejectOrder(orderId: string) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.REJECTED },
    });
  }

  async findOneOrderByStatus(orderId: string, orderStatus: OrderStatus) {
    const foundOrder = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        status: {
          equals: orderStatus,
        },
      },

      include: {
        creditCard: {
          select: {
            name: true,
            balance: true,
          },
        },

        bookingsToOrder: {
          select: {
            carId: true,
            quantity: true,
          },
        },
      },
    });

    if (!foundOrder) throw new ForbiddenException('Pending order not found');

    return foundOrder;
  }
}
