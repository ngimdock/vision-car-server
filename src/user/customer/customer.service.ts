import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PaginateDto } from 'src/common/dto';
import { PaginateResultType } from 'src/common/types';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CustomerService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllCustomers({
    offset,
    limit,
  }: PaginateDto): Promise<PaginateResultType> {
    const allUsers = await this.prisma.user.findMany({
      where: {
        role: Role.CUSTOMER,
      },

      select: {
        id: true,
        username: true,
        avatar: true,

        _count: {
          select: {
            bookedCars: true,
            likedCars: true,
          },
        },
      },

      orderBy: {
        name: 'asc',
      },
      skip: offset,
      take: limit,
    });

    const usersCount = await this.prisma.user.count();

    return {
      count: usersCount,
      hasMore: usersCount > offset + limit,
      data: allUsers,
    };
  }
}
