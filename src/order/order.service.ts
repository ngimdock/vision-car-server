import { Injectable } from '@nestjs/common';
import { CreditCard } from '@prisma/client';
import { InsufficientBalanceException } from 'src/credit-card/exceptions';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async create(customerId: string, createOrderDto: CreateOrderDto) {
    const { bookedCars, creditCards } = await this.userService.findMe(
      customerId,
    );

    const targetCreditCard = this.getCreditCard(
      creditCards,
      createOrderDto.creditCard,
    );

    const bookingsAmount = this.computeBookingsAmount(bookedCars);

    if (bookingsAmount > targetCreditCard.balance)
      throw new InsufficientBalanceException();

    const allBookingIds = bookedCars.map((booking) => booking.id);

    return { targetCreditCard, bookingsAmount };
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
}
