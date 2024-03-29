import { Injectable } from '@nestjs/common';
import { PaginateDto } from 'src/common/dto';
import { ErrorCode } from 'src/common/enums';
import { CustomHttpExeption } from 'src/common/exceptions';
import { PaginateResultType } from 'src/common/types';
import { PrismaService } from 'src/prisma/prisma.service';
import { CarRepository } from './car.repository';
import { STOCK_FINISHED } from './constants';
import { BookACarDto, CreateCarDto } from './dto';
import {
  BookingNotFoundException,
  CarNotFoundException,
  CarStockNotAvailableException,
  InvalidDataException,
} from './exceptions';
import { CarStockData } from './types';

@Injectable()
export class CarService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly carRepository: CarRepository,
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

  async bookACar(userId: string, bookACarDto: BookACarDto) {
    const { carId, quantity } = bookACarDto;

    const carToBook = await this.findOneById(carId);

    if (!carToBook) throw new CarNotFoundException();

    if (carToBook.availableStock < quantity)
      throw new CarStockNotAvailableException();

    const bookData = await this.prisma.$transaction(async () => {
      const bookData = await this.carRepository.bookACar(userId, bookACarDto);

      await this.decreaseCarStocks(carId, quantity);

      return bookData;
    });

    return bookData;
  }

  async unBookACar(bookingId: string) {
    const foundedBooking = await this.carRepository.findOneBooking(bookingId);

    if (!foundedBooking) throw new BookingNotFoundException();

    const bookingDeleted = await this.prisma.$transaction(async () => {
      const deletedBooking = await this.carRepository.unBookACar(bookingId);

      await this.increaseCarStocks(
        foundedBooking.carId,
        foundedBooking.quantity,
      );

      return deletedBooking;
    });

    return bookingDeleted;
  }

  async saveACar(userId: string, carId: string) {
    await this.findOneById(carId);

    try {
      await this.carRepository.saveACar(userId, carId);
    } catch (e) {
      throw new CustomHttpExeption();
    }
  }

  async unSaveACar(userId: string, carId: string) {
    await this.findOneById(carId);

    try {
      await this.carRepository.unsaveACar(userId, carId);
    } catch (e) {
      throw new CustomHttpExeption();
    }
  }

  async increaseCarsStocks(carsData: CarStockData[]) {
    return this.prisma.car.updateMany({
      where: {
        id: {
          in: carsData.map((car) => car.carId),
        },
      },
      data: {
        availableStock: {
          increment: carsData.find((car) => car.carId === car.carId)?.quantity,
        },
      },
    });
  }

  async decreaseCarsStocks(carsData: CarStockData[]) {
    return this.prisma.car.updateMany({
      where: {
        id: {
          in: carsData.map((car) => car.carId),
        },
      },
      data: {
        availableStock: {
          decrement: carsData.find((car) => car.carId === car.carId)?.quantity,
        },
      },
    });
  }

  async makeBookingsOrdered(bookings: string[]) {
    return this.prisma.userBookCar.updateMany({
      where: {
        id: {
          in: bookings,
        },
      },
      data: {
        isOrdered: true,
      },
    });
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

  async findManyByIds(carIds: string[]) {
    return await this.prisma.car.findMany({
      where: {
        id: {
          in: carIds,
        },
      },

      select: {
        id: true,
        brand: true,
        price: true,
      },
    });
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

  async decreaseCarStocks(carId: string, quantity: number) {
    await this.findOneById(carId);

    try {
      const carWithStockDecreased = await this.prisma.car.update({
        where: {
          id: carId,
        },

        data: {
          availableStock: { decrement: quantity },
        },
      });

      return carWithStockDecreased;
    } catch (err) {
      throw new CustomHttpExeption();
    }
  }

  async increaseCarStocks(carId: string, quantity: number) {
    await this.findOneById(carId);

    try {
      const carWithStockIncreased = await this.prisma.car.update({
        where: {
          id: carId,
        },

        data: {
          availableStock: { increment: quantity },
        },
      });

      return carWithStockIncreased;
    } catch (err) {
      throw new CustomHttpExeption();
    }
  }
}
