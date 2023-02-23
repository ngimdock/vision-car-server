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
import * as redisStore from 'cache-manager-redis-store';

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
