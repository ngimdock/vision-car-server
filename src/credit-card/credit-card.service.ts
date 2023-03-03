import { Injectable } from '@nestjs/common';
import { CustomHttpExeption } from 'src/common/exceptions';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCreditCardDto, UpdateCreditCardDto } from './dto';
import { CreditCardNotFoundException } from './exceptions';
@Injectable()
export class CreditCardService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createCreditCardDto: CreateCreditCardDto) {
    const { number, name, cvc, expiry } = createCreditCardDto;

    try {
      const createdCreditCard = await this.prisma.creditCard.create({
        data: {
          number,
          name,
          cvc,
          expiry,

          user: {
            connect: {
              id: userId,
            },
          },
        },
      });

      return createdCreditCard;
    } catch (err) {
      throw new CustomHttpExeption();
    }
  }

  findAll(userId: string) {
    return this.prisma.creditCard.findMany({
      where: {
        userId,
      },
    });
  }

  findOne(creditCardId: string) {
    return this.prisma.creditCard.findUnique({
      where: {
        id: creditCardId,
      },
    });
  }

  async update(creditCardId: string, updateCreditCardDto: UpdateCreditCardDto) {
    const foundCreditCard = await this.findOne(creditCardId);

    if (!foundCreditCard) throw new CreditCardNotFoundException();

    return this.prisma.creditCard.update({
      where: {
        id: creditCardId,
      },
      data: {
        ...updateCreditCardDto,
      },
    });
  }

  async remove(creditCardId: string) {
    const foundCreditCard = await this.findOne(creditCardId);

    if (!foundCreditCard) throw new CreditCardNotFoundException();

    return this.prisma.creditCard.delete({
      where: {
        id: creditCardId,
      },
    });
  }
}
