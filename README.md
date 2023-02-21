# Vision-car-server

E-commerce website for selling car.

This project is the server part of the wole project. Tech stack used: `nestjs`, `postgresql`, `prisma` and `redis`

# Steps to run the application

After inserting the environment variables presented in the `.env.example` file, follow these steps.

## Install dependences

```bash
yarn install
```

## Start all ressourses your server need to run the app

```bash
yarn resources:restart
```

This command will start `dev-db`, `redis` and `redis-commander` in the container.

## Deploy migrations in dev database

```bash
yarn prisma:dev:deploy
```

## Start the application

```bash
yarn start:dev
```

## View your deb database

```bash
yarn prisma:dev:studio
```

That's all you need to do if you want to run the app.

# Run the tests

## Start the test db

```bash
yarn db:test:restart
```

## Deploy migrations to the test db

```bash
yarn prisma:test:deploy
```

## Run your e2e tests

```bash
yarn test:e2e
```

## View your test database

```bash
yarn prisma:test:studio
```
