import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { GetUserId, Roles } from 'src/auth/decorator';
import { PaginateDto } from 'src/common/dto';
import { CarService } from './car.service';
import { BookACarDto, CreateCarDto, UpdateCarStockDto } from './dto';
import { CarRoute } from './enums';

@Controller(CarRoute.cars)
export class CarController {
  private static readonly carId = 'carId';
  private static readonly bookingId = 'bookingId';

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

  @Post(`${CarRoute.unBook}/:${CarController.bookingId}`)
  @HttpCode(HttpStatus.OK)
  unBookACar(@Param(CarController.bookingId, ParseUUIDPipe) bookingId: string) {
    return this.carService.unBookACar(bookingId);
  }

  @Post(`${CarRoute.save}/:${CarController.carId}`)
  @HttpCode(HttpStatus.OK)
  saveACar(
    @GetUserId() userId: string,
    @Param(CarController.carId, ParseUUIDPipe) carId: string,
  ) {
    return this.carService.saveACar(userId, carId);
  }

  @Post(`${CarRoute.unSave}/:${CarController.carId}`)
  @HttpCode(HttpStatus.OK)
  unSaveACar(
    @GetUserId() userId: string,
    @Param(CarController.carId, ParseUUIDPipe) carId: string,
  ) {
    return this.carService.unSaveACar(userId, carId);
  }

  @Roles(Role.ADMIN)
  @Patch(`${CarRoute.increaseStock}/:${CarController.carId}`)
  increaseCarStocks(
    @Param(CarController.carId, ParseUUIDPipe) carId: string,
    @Body() updateCarDto: UpdateCarStockDto,
  ) {
    return this.carService.increaseCarStocks(carId, updateCarDto.quantity);
  }

  @Roles(Role.ADMIN)
  @Patch(`${CarRoute.decreaseStock}/:${CarController.carId}`)
  decreaseCarStocks(
    @Param(CarController.carId, ParseUUIDPipe) carId: string,
    @Body() updateCarDto: UpdateCarStockDto,
  ) {
    return this.carService.decreaseCarStocks(carId, updateCarDto.quantity);
  }
}
