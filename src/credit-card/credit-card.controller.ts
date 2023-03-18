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
} from '@nestjs/common';
import { GetUserId } from 'src/auth/decorator';
import { CreditCardService } from './credit-card.service';
import {
  BalanceHandlerCreditCardDto,
  CreateCreditCardDto,
  UpdateCreditCardDto,
} from './dto';
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
  findOne(
    @GetUserId() userId: string,
    @Param(CreditCardController.creditCardId, ParseUUIDPipe)
    creditCardId: string,
  ) {
    return this.creditCardService.findOne(userId, creditCardId);
  }

  @Patch(`${CreditCardRoutes.update}/:${CreditCardController.creditCardId}`)
  update(
    @GetUserId() userId: string,
    @Param(CreditCardController.creditCardId, ParseUUIDPipe)
    creditCardId: string,
    @Body() updateCreditCardDto: UpdateCreditCardDto,
  ) {
    return this.creditCardService.update(
      userId,
      creditCardId,
      updateCreditCardDto,
    );
  }

  @Delete(`${CreditCardRoutes.delete}/:${CreditCardController.creditCardId}`)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @GetUserId() userId: string,
    @Param(CreditCardController.creditCardId, ParseUUIDPipe)
    creditCardId: string,
  ) {
    return this.creditCardService.remove(userId, creditCardId);
  }

  @Patch(`${CreditCardRoutes.recharge}/:${CreditCardController.creditCardId}`)
  rechargeCreditCard(
    @GetUserId() userId: string,
    @Param(CreditCardController.creditCardId, ParseUUIDPipe)
    creditCardId: string,
    @Body() balanceHandlerCreditCardDto: BalanceHandlerCreditCardDto,
  ) {
    return this.creditCardService.rechargeCreditCard(
      userId,
      creditCardId,
      balanceHandlerCreditCardDto,
    );
  }

  @Patch(`${CreditCardRoutes.debit}/:${CreditCardController.creditCardId}`)
  debitCreditCard(
    @GetUserId() userId: string,
    @Param(CreditCardController.creditCardId, ParseUUIDPipe)
    creditCardId: string,
    @Body() balanceHandlerCreditCardDto: BalanceHandlerCreditCardDto,
  ) {
    return this.creditCardService.debitCreditCard(
      userId,
      creditCardId,
      balanceHandlerCreditCardDto,
    );
  }
}
