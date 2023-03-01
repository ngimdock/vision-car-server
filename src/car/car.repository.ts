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
      throw new CustomHttpExeption();
    }
  }
}
