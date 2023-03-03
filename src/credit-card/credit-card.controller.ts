import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { GetUserId } from 'src/auth/decorator';
import { CreditCardService } from './credit-card.service';
import { CreateCreditCardDto, UpdateCreditCardDto } from './dto';
import { CreditCardRoutes } from './enum';

@Controller(CreditCardRoutes.creditCards)
export class CreditCardController {
  private static readonly creditCardId = 'creditCardId';

  constructor(private readonly creditCardService: CreditCardService) {}

  @Post(CreditCardRoutes.create)
  create(
    @GetUserId() userId: string,
    @Body() createCreditCardDto: CreateCreditCardDto,
  ) {
    return this.creditCardService.create(userId, createCreditCardDto);
  }

  @Get()
  findAll(@GetUserId() userId: string) {
    return this.creditCardService.findAll(userId);
  }

  @Get(`:${CreditCardController.creditCardId}`)
  findOne(@Param(CreditCardController.creditCardId) creditCardId: string) {
    return this.creditCardService.findOne(creditCardId);
  }

  @Patch(`${CreditCardRoutes.update}/:${CreditCardController.creditCardId}`)
  update(
    @Param(CreditCardController.creditCardId) creditCardId: string,
    @Body() updateCreditCardDto: UpdateCreditCardDto,
  ) {
    return this.creditCardService.update(creditCardId, updateCreditCardDto);
  }

  @Delete(`${CreditCardRoutes.delete}/:${CreditCardController.creditCardId}`)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param(CreditCardController.creditCardId) creditCardId: string) {
    return this.creditCardService.remove(creditCardId);
  }
}
