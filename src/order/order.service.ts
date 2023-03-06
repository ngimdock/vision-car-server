import { Injectable } from '@nestjs/common';
import { CreditCard, OrderStatus, Role } from '@prisma/client';
import { CarService } from 'src/car/car.service';
import { PaginateDto } from 'src/common/dto';
import { CustomHttpExeption } from 'src/common/exceptions';
import { PaginateResultType } from 'src/common/types';
import { CreditCardService } from 'src/credit-card/credit-card.service';
import {
  CreditCardNotFoundException,
  InsufficientBalanceException,
} from 'src/credit-card/exceptions';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { ValidateOrderDto } from './dto';
import { CreateOrderDto } from './dto/create-order.dto';
import {
  EmptyBookingsException,
  OrderNotDellableException,
  OrderNotFoundException,
} from './exceptions';
import { ShipperNotAvailableException } from './exceptions/shipper-not-available.exception';
import { OrderRepository } from './order.repository';
import { CreateOrderData } from './types';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
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

  async findAll({ offset, limit }: PaginateDto): Promise<PaginateResultType> {
    const allOrders = await this.prisma.order.findMany({
      select: {
        id: true,
        submitedAt: true,
        totalPrice: true,
        status: true,
        paymentType: true,
        deliveryContry: {
          select: {
            name: true,
            tax: true,
          },
        },
        customer: {
          select: {
            username: true,
            email: true,
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
      skip: offset,
      take: limit,
      orderBy: {
        submitedAt: 'desc',
      },
    });

    const count = await this.prisma.order.count();

    return {
      count,
      hasMore: offset + limit < count,
      data: allOrders,
    };
  }

  findCustomerOrders(customerId: string) {
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
        deliveryContry: {
          select: {
            name: true,
            code: true,
            tax: true,
          },
        },
        shipper: {
          select: {
            name: true,
            email: true,
            avatar: true,
          },
        },
        creditCard: {
          select: {
            number: true,
            name: true,
          },
        },
        documents: {
          select: {
            type: true,
            note: true,
            file: true,
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

  async cancelOrder(orderId: string) {
    const foundOrder = await this.orderRepository.findOneOrderByStatus(
      orderId,
      OrderStatus.PENDING,
    );

    const { id, totalPrice, customerId, creditCardId, bookingsToOrder } =
      foundOrder;

    const canceledOrder = await this.prisma.$transaction(async () => {
      const canceledOrder = await this.orderRepository.cancelOrder(id);

      await this.carService.increaseCarsStocks(bookingsToOrder);

      await this.creditCardService.rechargeCreditCard(
        customerId,
        creditCardId,
        { amount: totalPrice },
      );

      return canceledOrder;
    });

    return canceledOrder;
  }

  async resubmitOrder(orderId: string) {
    const foundOrder = await this.orderRepository.findOneOrderByStatus(
      orderId,
      OrderStatus.CANCELLED,
    );

    const {
      id,
      totalPrice,
      customerId,
      creditCardId,
      creditCard,
      bookingsToOrder,
    } = foundOrder;

    if (totalPrice > creditCard.balance)
      throw new InsufficientBalanceException();

    const resubmittedOrder = await this.prisma.$transaction(async () => {
      const resubmittedOrder = await this.orderRepository.resubmitOrder(id);

      await this.creditCardService.debitCreditCard(customerId, creditCardId, {
        amount: totalPrice,
      });

      await this.carService.decreaseCarsStocks(bookingsToOrder);

      return resubmittedOrder;
    });

    return resubmittedOrder;
  }

  async rejectOrder(orderId: string) {
    const foundOrder = await this.orderRepository.findOneOrderByStatus(
      orderId,
      OrderStatus.PENDING,
    );

    const { id, totalPrice, customerId, creditCardId, bookingsToOrder } =
      foundOrder;

    const rejectedOrder = await this.prisma.$transaction(async () => {
      const rejectedOrder = await this.orderRepository.rejectOrder(id);

      await this.creditCardService.rechargeCreditCard(
        customerId,
        creditCardId,
        { amount: totalPrice },
      );

      await this.carService.increaseCarsStocks(bookingsToOrder);

      return rejectedOrder;
    });

    return rejectedOrder;
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

  async remove(orderId: string) {
    const { id, status } = await this.findOneById(orderId);

    if (status !== OrderStatus.CANCELLED && status !== OrderStatus.REJECTED)
      throw new OrderNotDellableException();

    const deletedOrder = await this.prisma.$transaction(async () => {
      const deletedOrder = await this.prisma.order.delete({
        where: {
          id,
        },
      });

      return deletedOrder;
    });

    return deletedOrder;
  }

  async validateOrder(orderId: string, validateOrderDto: ValidateOrderDto) {
    const foundOrder = await this.orderRepository.findOneOrderByStatus(
      orderId,
      OrderStatus.PENDING,
    );

    const foundShipper = await this.isChipperAvailable(
      validateOrderDto.shipper,
      foundOrder.deliveryContry.name,
    );

    if (!foundShipper) throw new ShipperNotAvailableException();

    try {
      const validatedOrder = await this.orderRepository.validateOrder(
        foundOrder.id,
        validateOrderDto,
      );

      return validatedOrder;
    } catch (err) {
      console.log({ e: err.message });
      throw new CustomHttpExeption();
    }
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

  private async isChipperAvailable(shipperId: string, contryName: string) {
    console.log({ shipperId, contryName });

    const foundShipper = await this.prisma.user.findFirst({
      where: {
        id: shipperId,
        role: Role.SHIPPER,
        shipmentContry: {
          some: {
            contry: {
              name: {
                equals: contryName,
              },
            },
          },
        },
      },
    });

    return foundShipper;
  }
}
