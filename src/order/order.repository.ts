import { OrderStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

export class OrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  cancelOrder(orderId: string) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.CANCELLED },
    });
  }
}
