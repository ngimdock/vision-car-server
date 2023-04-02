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
import { ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { GetUserId, Roles } from 'src/auth/decorator';
import { PaginateDto } from 'src/common/dto';
import { CarService } from './car.service';
import { BookACarDto, CreateCarDto, UpdateCarStockDto } from './dto';
import { CarRoute } from './enums';

@ApiTags(CarRoute.cars)
@Controller(CarRoute.cars)
export class CarController {
  private static readonly id = 'id';
  private static readonly bookingId = 'bookingId';
  private static readonly carImages = 'carImages';

  constructor(private readonly carService: CarService) {}

  @Roles(Role.ADMIN)
  @Post()
  create(@GetUserId() adminId: string, @Body() createCarDto: CreateCarDto) {
    return this.carService.create(adminId, createCarDto);
  }

  @Get()
  findAll(@Query() paginate: PaginateDto) {
    return this.carService.findAll(paginate);
  }

  @Get(`:${CarController.id}`)
  findOneById(@Param(CarController.id) cardId: string) {
    return this.carService.findOneById(cardId);
  }

  @Roles(Role.ADMIN)
  @Delete(`:${CarController.id}`)
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteOne(@Param(`${CarController.id}`) carId: string) {
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

  @Post(`${CarRoute.save}/:${CarController.id}`)
  @HttpCode(HttpStatus.OK)
  saveACar(
    @GetUserId() userId: string,
    @Param(CarController.id, ParseUUIDPipe) carId: string,
  ) {
    return this.carService.saveACar(userId, carId);
  }

  @Post(`${CarRoute.unSave}/:${CarController.id}`)
  @HttpCode(HttpStatus.OK)
  unSaveACar(
    @GetUserId() userId: string,
    @Param(CarController.id, ParseUUIDPipe) carId: string,
  ) {
    return this.carService.unSaveACar(userId, carId);
  }

  @Roles(Role.ADMIN)
  @Patch(`${CarRoute.increaseStock}/:${CarController.id}`)
  increaseCarStocks(
    @Param(CarController.id, ParseUUIDPipe) carId: string,
    @Body() updateCarDto: UpdateCarStockDto,
  ) {
    return this.carService.increaseCarStocks(carId, updateCarDto.quantity);
  }

  @Roles(Role.ADMIN)
  @Patch(`${CarRoute.decreaseStock}/:${CarController.id}`)
  decreaseCarStocks(
    @Param(CarController.id, ParseUUIDPipe) carId: string,
    @Body() updateCarDto: UpdateCarStockDto,
  ) {
    return this.carService.decreaseCarStocks(carId, updateCarDto.quantity);
  }
}
