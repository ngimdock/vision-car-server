import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Role } from '@prisma/client';
import { GetUserId, Roles } from 'src/auth/decorator';
import { CarService } from './car.service';
import { CreateCarDto } from './dto';
import { CarRoute } from './enums';

@Controller(CarRoute.cars)
export class CarController {
  public static carId = 'carId';

  constructor(private readonly carService: CarService) {}

  @Roles(Role.ADMIN)
  @Post(CarRoute.create)
  create(@GetUserId() adminId: string, @Body() createCarDto: CreateCarDto) {
    return this.carService.create(adminId, createCarDto);
  }

  @Get(`:${CarController.carId}`)
  findOneById(@Param(CarController.carId) cardId: string) {
    return this.carService.findOneById(cardId);
  }
}
