import { ForbiddenException, Injectable } from '@nestjs/common';
import { PaginateDto } from 'src/common/dto';
import { ErrorCode } from 'src/common/enums';
import { CustomHttpExeption } from 'src/common/exceptions';
import { PaginateResultType } from 'src/common/types';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCarDto } from './dto';
import { CarNotFoundException, InvalidDataException } from './exceptions';

@Injectable()
export class CarService {
  private readonly STOCK_FINISHED = 0;

  constructor(private readonly prisma: PrismaService) {}

  async create(adminId: string, createCarDto: CreateCarDto) {
    const {
      brand,
      description,
      images,
      availableStock,
      price,
      reductionPercent,
    } = createCarDto;

    try {
      const createdCar = await this.prisma.car.create({
        data: {
          brand,
          description,
          images,
          availableStock,
          price,
          reductionPercent,
          publisherId: adminId,
        },

        include: {
          publisher: {
            select: {
              username: true,
              name: true,
            },
          },
        },
      });

      return createdCar;
    } catch (e) {
      if (e.code === ErrorCode.DUPLICATE_KEY) throw new InvalidDataException();

      throw new CustomHttpExeption();
    }
  }

  async bookACar(userId: string, carId: string) {
    const car = await this.findOneById(carId);

    if (car.availableStock === this?.STOCK_FINISHED)
      throw new ForbiddenException("Car's stock is finished");

    await this.prisma.car.update({
      where: {
        id: carId,
      },

      data: {
        availableStock: { decrement: 1 },
      },
    });

    const updatedUser = await this.prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        bookedCars: {
          connect: {
            id: carId,
          },
        },
      },

      include: {
        _count: {
          select: {
            bookedCars: true,
          },
        },
        bookedCars: {
          select: {
            id: true,
            brand: true,
            description: true,
            images: true,
            price: true,
            reductionPercent: true,
          },
        },
      },
    });

    return updatedUser;
  }

  async findAll(paginate: PaginateDto): Promise<PaginateResultType> {
    const { offset, limit } = paginate;

    const allCars = await this.prisma.car.findMany({
      where: {
        availableStock: { gt: this?.STOCK_FINISHED },
      },

      select: {
        id: true,
        brand: true,
        description: true,
        images: true,
        availableStock: true,
        price: true,
        reductionPercent: true,
      },

      orderBy: {
        updatedAt: 'desc',
      },

      skip: offset,
      take: limit,
    });

    const totalCar = await this.prisma.car.count({
      where: {
        availableStock: { gt: this?.STOCK_FINISHED },
      },
    });

    return {
      count: totalCar,
      hasMore: offset + limit < totalCar,
      data: allCars,
    };
  }

  async findOneById(cardId: string) {
    const car = await this.prisma.car.findUnique({
      where: {
        id: cardId,
      },

      include: {
        _count: {
          select: {
            usersWhoBooked: true,
            usersWhoSaved: true,
          },
        },
      },
    });

    if (!car) throw new CarNotFoundException();

    return car;
  }

  async deleteOne(carId: string) {
    await this.findOneById(carId);

    return await this.prisma.car.delete({
      where: {
        id: carId,
      },
    });
  }
}
