import { Test } from '@nestjs/testing';
import {
  CacheModule,
  CACHE_MANAGER,
  HttpStatus,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AppController } from 'src/app.controller';
import { APP_GUARD } from '@nestjs/core';
import { RoleGuard, SessionGuard } from 'src/auth/guard';
import { createClient, RedisClientOptions, RedisClientType } from 'redis';
import * as connectRedis from 'connect-redis';
import * as session from 'express-session';
import * as redisStore from 'cache-manager-redis-store';
import { AuthDto } from 'src/auth/dto';
import * as request from 'supertest';
import { AuthRoute } from 'src/auth/enums';
import { PrismaService } from 'src/prisma/prisma.service';

describe('App E2E', () => {
  let app: INestApplication;
  let configService: ConfigService;
  let prismaService: PrismaService;
  let redisClient: RedisClientType;
  let cookie = '';

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
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
          envFilePath: '.env.test',
        }),
        AuthModule,
        PrismaModule,
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
    }).compile();

    app = moduleRef.createNestApplication();

    configService = app.get(ConfigService);

    prismaService = app.get(PrismaService);

    const RedisStore = connectRedis(session);
    redisClient = createClient({
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
      }),
    );

    await redisClient
      .connect()
      .then(() => console.info('Redis connected for testing.'))
      .catch((err) => {
        throw err;
      });

    await app.init();

    await prismaService.cleanDb();
  });

  afterAll(async () => {
    const cache = app.get(CACHE_MANAGER);

    const cacheClient: RedisClientType = cache.store.getClient();

    await cacheClient.quit();
    await redisClient.disconnect();

    app.close();
  });

  describe('AppModule', () => {
    it('Should be defined', () => {
      expect(app).toBeDefined();
    });

    describe('Auth', () => {
      const authDto = {
        email: 'test@gmail.com',
        password: '123456',
      } as AuthDto;

      describe('Register', () => {
        const REGISTER_ROUTE = `${AuthRoute.auth}/${AuthRoute.register}`;

        it.todo('Should throw error if dto is not provided');
        it.todo('Should throw error if email is not provided');
        it.todo('Should throw error if password is less than 6 caracter');

        it('Should register', () => {
          return request(app.getHttpServer())
            .post(REGISTER_ROUTE)
            .send(authDto)
            .expect('set-cookie', /connect.sid/)
            .expect(HttpStatus.CREATED)
            .expect((req) => {
              cookie = req.headers?.['set-cookie'];
            });
        });
      });

      describe('Login', () => {
        const LOGIN_ROUTE = `${AuthRoute.auth}/${AuthRoute.login}`;

        it('Should Login', () => {
          return request(app.getHttpServer())
            .post(LOGIN_ROUTE)
            .send(authDto)
            .expect('set-cookie', /connect.sid/)
            .expect(HttpStatus.OK)
            .expect((req) => {
              cookie = req.headers?.['set-cookie'];
            });
        });
      });

      describe('Status', () => {
        it('Should get the app status informations', async () => {
          return request(app.getHttpServer())
            .get('/status')
            .expect(HttpStatus.OK);
        });
      });
    });
  });
});
