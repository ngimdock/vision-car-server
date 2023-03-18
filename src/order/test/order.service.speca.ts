import { Test } from '@nestjs/testing';
import { CarModule } from 'src/car/car.module';
import { CarService } from 'src/car/car.service';
import { CreditCardModule } from 'src/credit-card/credit-card.module';
import { CreditCardService } from 'src/credit-card/credit-card.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { OrderRepository } from '../order.repository';
import { OrderService } from '../order.service';
import { EmailService } from 'src/emails/email.service';
import { NodeMailerService } from 'src/emails/nodemailer.service';
import { EmailModule } from 'src/emails/email.module';
import { ShipperService } from 'src/user/shipper/shipper.service';

jest.mock('../../prisma/prisma.service');

describe('OrderService', () => {
  let service: OrderService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [CarModule, EmailModule],
      providers: [
        PrismaService,
        OrderService,
        OrderRepository,
        ShipperService,
        CreditCardService,
        UserService,
        NodeMailerService,
      ],
    }).compile();

    service = module.get(OrderService);
  });

  test('bootstrap', () => {
    expect(service).toBeDefined();
  });
});
