import { Injectable } from '@nestjs/common';
import { CustomHttpExeption } from 'src/common/exceptions';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  BalanceHandlerCreditCardDto,
  CreateCreditCardDto,
  UpdateCreditCardDto,
} from './dto';
import {
  CreditCardNotFoundException,
  InsufficientBalanceException,
} from './exceptions';
@Injectable()
export class CreditCardService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createCreditCardDto: CreateCreditCardDto) {
    try {
      const createdCreditCard = await this.prisma.creditCard.create({
        data: {
          ...createCreditCardDto,
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });

      return createdCreditCard;
    } catch (err) {
      console.log({ message: err.message });
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

  async findOne(userId: string, creditCardId: string) {
    const creditCard = await this.prisma.creditCard.findFirst({
      where: {
        id: creditCardId,
        userId,
      },
    });

    if (!creditCard) throw new CreditCardNotFoundException();

    return creditCard;
  }

  async update(
    userId: string,
    creditCardId: string,
    updateCreditCardDto: UpdateCreditCardDto,
  ) {
    await this.findOne(userId, creditCardId);

    return this.prisma.creditCard.update({
      where: {
        id: creditCardId,
      },
      data: {
        ...updateCreditCardDto,
      },
    });
  }

  async remove(userId: string, creditCardId: string) {
    await this.findOne(userId, creditCardId);

    return this.prisma.creditCard.delete({
      where: {
        id: creditCardId,
      },
    });
  }

  async rechargeCreditCard(
    userId: string,
    creditCardId: string,
    { amount }: BalanceHandlerCreditCardDto,
  ) {
    await this.findOne(userId, creditCardId);

    return this.prisma.creditCard.update({
      where: {
        id: creditCardId,
      },

      data: {
        balance: {
          increment: amount,
        },
      },
    });
  }

  async debitCreditCard(
    userId: string,
    creditCardId: string,
    { amount: amountToDebit }: BalanceHandlerCreditCardDto,
  ) {
    const foundCreditCard = await this.findOne(userId, creditCardId);

    if (amountToDebit > foundCreditCard.balance)
      throw new InsufficientBalanceException();

    const creditedCardDebited = await this.prisma.creditCard.update({
      where: {
        id: creditCardId,
      },

      data: {
        balance: { decrement: amountToDebit },
      },
    });

    return creditedCardDebited;
  }
}
