import { Injectable } from '@nestjs/common';
import { CustomHttpExeption } from 'src/common/exceptions';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCarDto } from './dto';

@Injectable()
export class CarService {
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
      throw new CustomHttpExeption();
    }
  }
}
