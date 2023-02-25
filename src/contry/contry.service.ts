import { Injectable } from '@nestjs/common';
import { PaginateDto } from 'src/common/dto';
import { CustomHttpExeption } from 'src/common/exceptions';
import { PaginateResultType } from 'src/common/types';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateContryDto } from './dto/create-contry.dto';
import { UpdateContryDto } from './dto/update-contry.dto';
import { ContryNotFoundException } from './exceptions';

@Injectable()
export class ContryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createContryDto: CreateContryDto) {
    try {
      const createdContry = await this.prisma.contry.create({
        data: {
          ...createContryDto,
        },
      });

      return createdContry;
    } catch (e) {
      throw new CustomHttpExeption();
    }
  }

  async findAll({ offset, limit }: PaginateDto): Promise<PaginateResultType> {
    const allContrys = await this.prisma.contry.findMany({
      skip: offset,
      take: limit,
      orderBy: {
        name: 'asc',
      },
    });

    const contrysCount = await this.prisma.contry.count();

    return {
      count: contrysCount,
      hasMore: contrysCount > offset + limit,
      data: allContrys,
    };
  }

  async findOne(contryId: string) {
    const foundContry = await this.prisma.contry.findUnique({
      where: {
        id: contryId,
      },
    });

    if (!foundContry) throw new ContryNotFoundException();

    return foundContry;
  }

  async update(contryId: string, updateContryDto: UpdateContryDto) {
    await this.findOne(contryId);

    const updatedContry = await this.prisma.contry.update({
      where: {
        id: contryId,
      },

      data: {
        ...updateContryDto,
      },
    });

    return updatedContry;
  }

  async delete(contryId: string) {
    await this.findOne(contryId);

    await this.prisma.contry.delete({
      where: {
        id: contryId,
      },
    });
  }
}
