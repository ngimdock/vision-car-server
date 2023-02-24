import { Injectable } from '@nestjs/common';
import { PaginateDto } from 'src/common/dto';
import { ErrorCode } from 'src/common/enums';
import { CustomHttpExeption } from 'src/common/exceptions';
import { PaginateResultType } from 'src/common/types';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { STOCK_FINISHED } from './constants';
import { CreateCarDto } from './dto';
import {
  CarNotFoundException,
  CarStockFinishedException,
  InvalidDataException,
} from './exceptions';

@Injectable()
export class CarService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

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
    try {
      const carToBook = await this.findOneById(carId);

      if (carToBook.availableStock <= STOCK_FINISHED)
        throw new CarStockFinishedException();

      await this.userService.userBookCar(userId, carId);

      await this.decrementCarsStocks(carId);
    } catch (e) {
      throw new CustomHttpExeption();
    }
  }

  async unBookACar(userId: string, carId: string) {
    try {
      await this.userService.userUnBookCar(userId, carId);

      await this.incrementCarsStocks(carId);
    } catch (e) {
      throw new CustomHttpExeption();
    }
  }

  async saveACar(userId: string, carId: string) {
    try {
      await this.userService.userSaveCar(userId, carId);
    } catch (e) {
      throw new CustomHttpExeption();
    }
  }

  async unSaveACar(userId: string, carId: string) {
    try {
      await this.userService.userUnSaveCar(userId, carId);
    } catch (e) {
      throw new CustomHttpExeption();
    }
  }

  async findAll(paginate: PaginateDto): Promise<PaginateResultType> {
    const { offset, limit } = paginate;

    const allCars = await this.prisma.car.findMany({
      where: {
        availableStock: { gt: STOCK_FINISHED },
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
        availableStock: { gt: STOCK_FINISHED },
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

  private decrementCarsStocks(carId: string) {
    return this.prisma.car.update({
      where: {
        id: carId,
      },

      data: {
        availableStock: { decrement: 1 },
      },
    });
  }

  private incrementCarsStocks(carId: string) {
    return this.prisma.car.update({
      where: {
        id: carId,
      },

      data: {
        availableStock: { increment: 1 },
      },
    });
  }
}
