import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PaginateDto } from 'src/common/dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ShipperService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllShippers(paginate: PaginateDto) {
    const { offset, limit } = paginate;
    return this.prisma.user.findMany({
      where: {
        role: Role.SHIPPER,
      },

      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        avatar: true,
        shipmentContry: {
          select: {
            price: true,
            contry: {
              select: {
                name: true,
                tax: true,
              },
            },
          },
        },
        ordersToShip: {
          select: {
            totalPrice: true,
            deliveryContry: {
              select: {
                name: true,
                tax: true,
              },
            },
          },
        },
      },
      skip: offset,
      take: limit,
    });
  }
}
