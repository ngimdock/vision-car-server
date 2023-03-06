import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OrderStatus } from '@prisma/client';
import { CarService } from 'src/car/car.service';
import { CustomHttpExeption } from 'src/common/exceptions';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SchedulerService {
  constructor(
    private readonly carService: CarService,
    private readonly prisma: PrismaService,
  ) {}

  private readonly logger = new Logger(SchedulerService.name);

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async unBookAllBookingNotOrdered() {
    const bookingsNotOrdered = await this.prisma.userBookCar.findMany({
      where: {
        isOrdered: false,
      },
    });

    try {
      await Promise.all(
        bookingsNotOrdered.map((booking) =>
          this.carService.unBookACar(booking.id),
        ),
      );
    } catch (err) {
      throw new CustomHttpExeption();
    }
    this.logger.debug('All bookings not ordered have been unbooked.');
  }

  @Cron(CronExpression.EVERY_YEAR)
  async deleteAllSippedOrders() {
    try {
      await this.prisma.order.deleteMany({
        where: {
          status: OrderStatus.SHIPPED,
        },
      });

      this.logger.debug('All shipped orders have been deleted.');
    } catch (err) {
      throw new CustomHttpExeption();
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async deleteAllCanceledOrders() {
    try {
      await this.prisma.order.deleteMany({
        where: {
          status: OrderStatus.CANCELLED,
        },
      });

      this.logger.debug('All canceled orders have been deleted.');
    } catch (err) {
      throw new CustomHttpExeption();
    }
  }
}
