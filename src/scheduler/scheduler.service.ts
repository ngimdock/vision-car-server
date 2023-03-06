import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CarService } from 'src/car/car.service';
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

    await Promise.all(
      bookingsNotOrdered.map((booking) =>
        this.carService.unBookACar(booking.id),
      ),
    );

    this.logger.debug('All bookings not ordered have been unbooked.');
  }

  /**
   * @TODO DELETE All cancele orders after 1 day
   * */

  /**
   * @TODO DELETE All cars with finished stock that have 0 bookings and 0 order with status 'submitted'
   */

  /**
   * @TODO DELETE All orders with status "delivered" every new year
   */

  // @Cron(CronExpression.EVERY_10_SECONDS)
  // async deleteCarsWithFinishedStock() {
  //   await this.prisma.car.deleteMany({
  //     where: {
  //       availableStock: { lte: STOCK_FINISHED },
  //     },
  //   });

  //   this.logger.verbose('Deleted cars with finished stock');
  // }
}
