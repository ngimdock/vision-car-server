import { ForbiddenException, Injectable } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ShipOrderDto, ValidateOrderDto } from './dto';

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
        deliveryContry: {
          select: {
            name: true,
            tax: true,
          },
        },
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

    if (!foundOrder) throw new ForbiddenException('Order not found.');

    return foundOrder;
  }

  async validateOrder(orderId: string, validateOrderDto: ValidateOrderDto) {
    const { documents, validatedAt } = validateOrderDto;

    const validatedOrder = await this.prisma.order.update({
      data: {
        status: OrderStatus.VALIDATED,
        validatedAt,
        documents: {
          createMany: {
            data: documents,
          },
        },
        shipper: {
          connect: {
            id: validateOrderDto.shipper,
          },
        },
      },
      where: {
        id: orderId,
      },

      select: {
        submitedAt: true,
        validatedAt: true,
        totalPrice: true,
        status: true,
        shipper: {
          select: {
            name: true,
            email: true,
          },
        },
        documents: {
          select: {
            type: true,
            note: true,
            file: true,
          },
        },
        bookingsToOrder: {
          select: {
            quantity: true,
            car: {
              select: {
                brand: true,
                price: true,
              },
            },
          },
        },
        customer: { select: { email: true } },
      },
    });

    return validatedOrder;
  }

  async shipOrder(orderId: string, shipOrderDto: ShipOrderDto) {
    const { shippedAt } = shipOrderDto;

    const shippedOrder = await this.prisma.order.update({
      data: {
        status: OrderStatus.SHIPPED,
        shippedAt,
      },
      where: {
        id: orderId,
      },

      select: {
        submitedAt: true,
        validatedAt: true,
        shippedAt: true,
        totalPrice: true,
        status: true,
      },
    });

    return shippedOrder;
  }
}
