import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { RedisClientOptions } from 'redis';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { RoleGuard, SessionGuard } from './auth/guard';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { CarModule } from './car/car.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { ContryModule } from './contry/contry.module';
import { OrderModule } from './order/order.module';
import { CreditCardModule } from './credit-card/credit-card.module';
import { UploadsModule } from './uploads/uploads.module';
import * as redisStore from 'cache-manager-redis-store';
import { EmailModule } from './emails/email.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    CacheModule.registerAsync<RedisClientOptions>({
      isGlobal: true,

      useFactory: (configService: ConfigService) => {
        return {
          store: redisStore,
          url: configService.getOrThrow('REDIS_URL'),
        };
      },

      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    PrismaModule,
    UserModule,
    CarModule,
    SchedulerModule,
    ContryModule,
    OrderModule,
    CreditCardModule,
    UploadsModule,
    EmailModule,
    PaymentModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: SessionGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class AppModule {}
