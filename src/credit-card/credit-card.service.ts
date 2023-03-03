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

  findOne(userId: string, creditCardId: string) {
    return this.prisma.creditCard.findFirst({
      where: {
        id: creditCardId,
        userId,
      },
    });
  }

  async update(
    userId: string,
    creditCardId: string,
    updateCreditCardDto: UpdateCreditCardDto,
  ) {
    const foundCreditCard = await this.findOne(userId, creditCardId);

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

  async remove(userId: string, creditCardId: string) {
    const foundCreditCard = await this.findOne(userId, creditCardId);

    if (!foundCreditCard) throw new CreditCardNotFoundException();

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
    const foundCreditCard = await this.findOne(userId, creditCardId);

    if (!foundCreditCard) throw new CreditCardNotFoundException();

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

    if (!foundCreditCard) throw new CreditCardNotFoundException();

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
