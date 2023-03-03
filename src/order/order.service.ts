import { Injectable } from '@nestjs/common';
import { CreditCard } from '@prisma/client';
import { CreditCardService } from 'src/credit-card/credit-card.service';
import {
  CreditCardNotFoundException,
  InsufficientBalanceException,
} from 'src/credit-card/exceptions';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly creditCardService: CreditCardService,
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

    const bookingsAmount = this.computeBookingsAmount(bookedCars);

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
        createOrderDto,
        bookingsToConnectData,
      );

      return orderCreated;
    });

    return createdOrder;
  }

  findAll() {
    return `This action returns all order`;
  }

  async findOneById(orderId: string) {
    return orderId;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
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
    createOrderDto: CreateOrderDto,
    bookings: { id: string }[],
  ) {
    const { contry, creditCard, paymentType } = createOrderDto;

    const orderCreated = await this.prisma.order.create({
      data: {
        paymentType,
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
