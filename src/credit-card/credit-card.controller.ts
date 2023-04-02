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
import { ApiTags } from '@nestjs/swagger';
import { GetUserId } from 'src/auth/decorator';
import { CreditCardService } from './credit-card.service';
import {
  BalanceHandlerCreditCardDto,
  CreateCreditCardDto,
  UpdateCreditCardDto,
} from './dto';
import { CreditCardRoutes } from './enum';

@ApiTags(CreditCardRoutes.creditCards)
@Controller(CreditCardRoutes.creditCards)
export class CreditCardController {
  private static readonly id = 'id';

  constructor(private readonly creditCardService: CreditCardService) {}

  @Post()
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

  @Get(`:${CreditCardController.id}`)
  findOne(
    @GetUserId() userId: string,
    @Param(CreditCardController.id, ParseUUIDPipe)
    creditCardId: string,
  ) {
    return this.creditCardService.findOne(userId, creditCardId);
  }

  @Patch(`:${CreditCardController.id}`)
  update(
    @GetUserId() userId: string,
    @Param(CreditCardController.id, ParseUUIDPipe)
    creditCardId: string,
    @Body() updateCreditCardDto: UpdateCreditCardDto,
  ) {
    return this.creditCardService.update(
      userId,
      creditCardId,
      updateCreditCardDto,
    );
  }

  @Delete(`:${CreditCardController.id}`)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @GetUserId() userId: string,
    @Param(CreditCardController.id, ParseUUIDPipe)
    creditCardId: string,
  ) {
    return this.creditCardService.remove(userId, creditCardId);
  }

  @Patch(`${CreditCardRoutes.recharge}/:${CreditCardController.id}`)
  rechargeCreditCard(
    @GetUserId() userId: string,
    @Param(CreditCardController.id, ParseUUIDPipe)
    creditCardId: string,
    @Body() balanceHandlerCreditCardDto: BalanceHandlerCreditCardDto,
  ) {
    return this.creditCardService.rechargeCreditCard(
      userId,
      creditCardId,
      balanceHandlerCreditCardDto,
    );
  }

  @Patch(`${CreditCardRoutes.debit}/:${CreditCardController.id}`)
  debitCreditCard(
    @GetUserId() userId: string,
    @Param(CreditCardController.id, ParseUUIDPipe)
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
