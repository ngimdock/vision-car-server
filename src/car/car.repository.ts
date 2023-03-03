import { Injectable } from '@nestjs/common';
import { CustomHttpExeption } from 'src/common/exceptions';
import { PrismaService } from 'src/prisma/prisma.service';
import { BookACarDto } from './dto';

@Injectable()
export class CarRepository {
  constructor(private readonly prisma: PrismaService) {}

  async bookACar(userId: string, bookACar: BookACarDto) {
    try {
      const { carId, quantity } = bookACar;

      const bookData = await this.prisma.userBookCar.create({
        data: {
          user: { connect: { id: userId } },
          car: { connect: { id: carId } },
          quantity,
        },

        select: {
          bookedAt: true,
          quantity: true,
          car: {
            select: {
              brand: true,
              images: true,
              price: true,
            },
          },
        },
      });

      return bookData;
    } catch (err) {
      console.log({ msg: err.code });

      throw new CustomHttpExeption();
    }
  }

  async unBookACar(bookingId: string) {
    try {
      const unBookData = await this.prisma.userBookCar.delete({
        where: {
          id: bookingId,
        },

        select: {
          bookedAt: true,
          quantity: true,
          car: {
            select: {
              brand: true,
              images: true,
              price: true,
            },
          },
        },
      });

      return unBookData;
    } catch (err) {
      throw new CustomHttpExeption();
    }
  }

  async findOneBooking(bookingId: string) {
    const booking = await this.prisma.userBookCar.findUnique({
      where: {
        id: bookingId,
      },
    });

    return booking;
  }

  saveACar(userId: string, carId: string) {
    return this.prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        savedCars: {
          connect: {
            id: carId,
          },
        },
      },
    });
  }

  unsaveACar(userId: string, carId: string) {
    return this.prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        savedCars: {
          disconnect: {
            id: carId,
          },
        },
      },
    });
  }
}
