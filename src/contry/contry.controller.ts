import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { GetUserId, Roles } from 'src/auth/decorator';
import { PaginateDto } from 'src/common/dto';
import { ContryService } from './contry.service';
import { AddShipmentContryDto } from './dto';
import { CreateContryDto } from './dto/create-contry.dto';
import { UpdateContryDto } from './dto/update-contry.dto';
import { ContryRoute } from './enum';

@Roles(Role.ADMIN)
@Controller(ContryRoute.contrys)
export class ContryController {
  private static readonly contryId = 'contryId';

  constructor(private readonly contryService: ContryService) {}

  @Roles(Role.SHIPPER)
  @Post(`${ContryRoute.addShipmentContry}/:${ContryController.contryId}`)
  @HttpCode(HttpStatus.OK)
  addUserShipmentContry(
    @GetUserId() shipperId: string,
    @Param(ContryController.contryId, ParseUUIDPipe) contryId: string,
    @Body() addShipmentContryDto: AddShipmentContryDto,
  ) {
    return this.contryService.addUserShipmentContry(
      shipperId,
      contryId,
      addShipmentContryDto,
    );
  }

  @Post(ContryRoute.create)
  create(@Body() createContryDto: CreateContryDto) {
    return this.contryService.create(createContryDto);
  }

  @Get(ContryRoute.all)
  findAll(@Query() paginate: PaginateDto) {
    return this.contryService.findAll(paginate);
  }

  @Get(`:${ContryController.contryId}`)
  findOne(@Param(ContryController.contryId) contryId: string) {
    return this.contryService.findOne(contryId);
  }

  @Patch(`${ContryRoute.update}/:${ContryController.contryId}`)
  update(
    @Param(ContryController.contryId) contryId: string,
    @Body() updateContryDto: UpdateContryDto,
  ) {
    return this.contryService.update(contryId, updateContryDto);
  }

  @Delete(`${ContryRoute.delete}/:${ContryController.contryId}`)
  delete(@Param(ContryController.contryId) contryId: string) {
    return this.contryService.delete(contryId);
  }
}
