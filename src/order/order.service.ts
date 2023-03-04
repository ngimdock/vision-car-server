import { Injectable } from '@nestjs/common';
import { CreditCard } from '@prisma/client';
import { CarService } from 'src/car/car.service';
import { CreditCardService } from 'src/credit-card/credit-card.service';
import {
  CreditCardNotFoundException,
  InsufficientBalanceException,
} from 'src/credit-card/exceptions';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { EmptyBookingsException, OrderNotFoundException } from './exceptions';
import { CreateOrderData } from './types';

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly creditCardService: CreditCardService,
    private readonly carService: CarService,
  ) {}

  async create(customerId: string, createOrderDto: CreateOrderDto) {
    const { bookedCars, creditCards } = await this.userService.findMe(
      customerId,
    );

    const targetCreditCard = this.getCreditCard(
      creditCards,
      createOrderDto.creditCard,
    );

    if (!targetCreditCard) throw new CreditCardNotFoundException();
    if (!bookedCars.length) throw new EmptyBookingsException();

    const bookingsAmount = this.computeBookingsAmount(bookedCars);

    console.log({ bookingsAmount, balance: targetCreditCard.balance });

    if (bookingsAmount > targetCreditCard.balance)
      throw new InsufficientBalanceException();

    const bookingsToConnectData = this.getbookingsToConnectData(bookedCars);

    const createdOrder = await this.prisma.$transaction(async () => {
      await this.creditCardService.debitCreditCard(
        customerId,
        createOrderDto.creditCard,
        { amount: bookingsAmount },
      );

      const orderCreated = await this.makeAndOrder(
        customerId,
        { ...createOrderDto, bookingsAmount },
        bookingsToConnectData,
      );

      await this.carService.makeBookingsOrdered(
        bookingsToConnectData.map((b) => b.id),
      );

      return orderCreated;
    });

    return createdOrder;
  }

  findAll(customerId: string) {
    return this.prisma.order.findMany({
      where: {
        customerId,
      },

      select: {
        id: true,
        status: true,
        totalPrice: true,
        paymentType: true,
        submitedAt: true,
        validatedAt: true,
        deliveredAt: true,
        deliveryContry: true,
        creditCard: {
          select: {
            number: true,
            name: true,
          },
        },
        bookingsToOrder: {
          select: {
            quantity: true,
            car: {
              select: {
                brand: true,
                price: true,
                images: true,
              },
            },
          },
        },
      },
    });
  }

  async findOneById(orderId: string) {
    const foundOrder = await this.prisma.order.findUnique({
      where: {
        id: orderId,
      },
    });

    if (!foundOrder) throw new OrderNotFoundException();

    return foundOrder;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  async remove(orderId: string) {
    const { id, totalPrice, customerId, creditCardId } = await this.findOneById(
      orderId,
    );

    const deletedOrder = await this.prisma.$transaction(async () => {
      const deletedOrder = await this.prisma.order.delete({
        where: {
          id,
        },
      });

      await this.creditCardService.rechargeCreditCard(
        customerId,
        creditCardId,
        { amount: totalPrice },
      );

      return deletedOrder;
    });

    return deletedOrder;
  }

  private computeBookingsAmount(bookings: any[]): number {
    const INITIAL_AMOUNT = 0;

    const bookingsAmount = bookings.reduce(
      (amountAccumulator, currentBooking) => {
        return (amountAccumulator +=
          currentBooking.quantity * currentBooking.car.price);
      },
      INITIAL_AMOUNT,
    );

    return bookingsAmount;
  }

  private getCreditCard(
    creditCards: CreditCard[],
    creditCardIdTarget: string,
  ): CreditCard {
    return creditCards.find(
      (currentCreditCard) => currentCreditCard.id === creditCardIdTarget,
    );
  }

  private getbookingsToConnectData(bookedCars: any[]) {
    return bookedCars.map((booking) => ({
      id: booking.id,
    }));
  }

  private async makeAndOrder(
    customerId: string,
    createOrderData: CreateOrderData,
    bookings: { id: string }[],
  ) {
    const { contry, creditCard, paymentType, bookingsAmount } = createOrderData;

    const orderCreated = await this.prisma.order.create({
      data: {
        paymentType,
        totalPrice: bookingsAmount,
        customer: {
          connect: {
            id: customerId,
          },
        },
        deliveryContry: {
          connect: {
            id: contry,
          },
        },
        creditCard: {
          connect: {
            id: creditCard,
          },
        },
        bookingsToOrder: {
          connect: bookings,
        },
      },
    });

    return orderCreated;
  }
}
