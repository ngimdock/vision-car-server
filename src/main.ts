import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as connectRedis from 'connect-redis';
import * as session from 'express-session';
import { createClient } from 'redis';
import { AppModule } from './app.module';
import {
  TimeoutInterceptor,
  WrapResponseInterceptor,
} from './common/interceptors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = new Logger('bootstrap');

  const configService = app.get(ConfigService);

  const RedisStore = connectRedis(session);
  const redisClient = createClient({
    url: configService.getOrThrow('REDIS_URL'),
    legacyMode: true,
  });

  app.use(
    session({
      secret: configService.getOrThrow('SESSION_SECRET'),
      resave: false,
      saveUninitialized: false,
      store: new RedisStore({
        client: redisClient,
      }),
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.useGlobalInterceptors(
    new WrapResponseInterceptor(),
    new TimeoutInterceptor(),
  );

  await redisClient
    .connect()
    .then(() => logger.debug('Redis connected.'))
    .catch((err) => {
      throw err;
    });

  const config = new DocumentBuilder()
    .setTitle('Vision-car')
    .setDescription('And e-commerce API for selling cars.')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(3333);
}
bootstrap();
