import { Body, Controller, Post } from '@nestjs/common';
import { Role } from '@prisma/client';
import { GetUserId, Roles } from 'src/auth/decorator';
import { CarService } from './car.service';
import { CreateCarDto } from './dto';
import { CarRoute } from './enums';

@Roles(Role.ADMIN)
@Controller(CarRoute.cars)
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Post(CarRoute.create)
  create(@GetUserId() adminId: string, @Body() createCarDto: CreateCarDto) {
    return this.carService.create(adminId, createCarDto);
  }
}
