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
      skip: offset,
      take: limit,
    });
  }
}
