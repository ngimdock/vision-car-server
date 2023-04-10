import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { GetUserId, PublicRoute, Roles } from 'src/auth/decorator';
import { PaginateDto } from 'src/common/dto';
import { ContryService } from './contry.service';
import { AddShipmentContryDto } from './dto';
import { CreateContryDto } from './dto/create-contry.dto';
import { UpdateContryDto } from './dto/update-contry.dto';
import { ContryRoute } from './enum';
import { EVENT_EMITTER } from 'src/events/constants';
import { MyEmitter } from 'src/events/entities';
import { events } from 'src/common/constants';

@Roles(Role.ADMIN)
@ApiTags(ContryRoute.countries)
@Controller(ContryRoute.countries)
export class ContryController {
  private static readonly id = 'id';

  constructor(
    private readonly contryService: ContryService,
    @Inject(EVENT_EMITTER) private readonly event: MyEmitter,
  ) {}

  @Roles(Role.SHIPPER)
  @Post(`${ContryRoute.addShipmentContry}/:${ContryController.id}`)
  @HttpCode(HttpStatus.OK)
  addUserShipmentContry(
    @GetUserId() shipperId: string,
    @Param(ContryController.id, ParseUUIDPipe) contryId: string,
    @Body() addShipmentContryDto: AddShipmentContryDto,
  ) {
    return this.contryService.addUserShipmentContry(
      shipperId,
      contryId,
      addShipmentContryDto,
    );
  }

  @Roles(Role.SHIPPER)
  @Post(`${ContryRoute.removeShipmentContry}/:${ContryController.id}`)
  @HttpCode(HttpStatus.OK)
  removeUserShipmentContry(
    @GetUserId() shipperId: string,
    @Param(ContryController.id, ParseUUIDPipe) contryId: string,
  ) {
    return this.contryService.removeUserShipmentContry(shipperId, contryId);
  }

  @Post()
  create(@Body() createContryDto: CreateContryDto) {
    return this.contryService.create(createContryDto);
  }

  @PublicRoute()
  @Get()
  findAll(@Query() paginate: PaginateDto) {
    return this.contryService.findAll(paginate);
  }

  @Get(`:${ContryController.id}`)
  findOne(@Param(ContryController.id) contryId: string) {
    return this.contryService.findOne(contryId);
  }

  @Patch(`:${ContryController.id}`)
  update(
    @Param(ContryController.id) contryId: string,
    @Body() updateContryDto: UpdateContryDto,
  ) {
    return this.contryService.update(contryId, updateContryDto);
  }

  @Delete(`:${ContryController.id}`)
  delete(@Param(ContryController.id) contryId: string) {
    return this.contryService.delete(contryId);
  }

  @PublicRoute()
  @Post('test')
  test(@Body() testBody: { name: string }) {
    this.event.emit(events.USER_CREATED, testBody);
  }
}
