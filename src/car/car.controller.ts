import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { GetUserId, Roles } from 'src/auth/decorator';
import { PaginateDto } from 'src/common/dto';
import { CarService } from './car.service';
import { BookACarDto, CreateCarDto } from './dto';
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

  @Get(CarRoute.all)
  findAll(@Query() paginate: PaginateDto) {
    return this.carService.findAll(paginate);
  }

  @Get(`${CarRoute.details}/:${CarController.carId}`)
  findOneById(@Param(CarController.carId) cardId: string) {
    return this.carService.findOneById(cardId);
  }

  @Roles(Role.ADMIN)
  @Delete(`${CarRoute.delete}/:${CarController.carId}`)
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteOne(@Param(`${CarController.carId}`) carId: string) {
    return this.carService.deleteOne(carId);
  }

  @Post(CarRoute.book)
  @HttpCode(HttpStatus.OK)
  bookACar(@GetUserId() userId: string, @Body() bookACarDto: BookACarDto) {
    return this.carService.bookACar(userId, bookACarDto);
  }

  @Post(`${CarRoute.unBook}/:${CarController.carId}`)
  @HttpCode(HttpStatus.OK)
  unBookACar(
    @GetUserId() userId: string,
    @Param(CarController.carId) carId: string,
  ) {
    return this.carService.unBookACar(userId, carId);
  }

  @Post(`${CarRoute.save}/:${CarController.carId}`)
  @HttpCode(HttpStatus.OK)
  saveACar(
    @GetUserId() userId: string,
    @Param(CarController.carId) carId: string,
  ) {
    return this.carService.saveACar(userId, carId);
  }

  @Post(`${CarRoute.unSave}/:${CarController.carId}`)
  @HttpCode(HttpStatus.OK)
  unSaveACar(
    @GetUserId() userId: string,
    @Param(CarController.carId) carId: string,
  ) {
    return this.carService.unSaveACar(userId, carId);
  }
}
