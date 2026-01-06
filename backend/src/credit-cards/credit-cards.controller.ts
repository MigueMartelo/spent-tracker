import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CreditCard, type User } from '@prisma/client';
import { CreditCardsService } from './credit-cards.service';
import { CreateCreditCardDto } from './dto/create-credit-card.dto';
import { UpdateCreditCardDto } from './dto/update-credit-card.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('credit-cards')
@UseGuards(JwtAuthGuard)
export class CreditCardsController {
  constructor(private readonly creditCardsService: CreditCardsService) {}

  @Post()
  create(
    @CurrentUser() user: User,
    @Body() createCreditCardDto: CreateCreditCardDto,
  ) {
    return this.creditCardsService.create(user.id, createCreditCardDto);
  }

  @Get()
  findAll(@CurrentUser() user: User) {
    return this.creditCardsService.findAll(user.id);
  }

  @Get(':id')
  findOne(@CurrentUser() user: User, @Param('id') id: string) {
    return this.creditCardsService.findOne(id, user.id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() updateCreditCardDto: UpdateCreditCardDto,
  ) {
    return this.creditCardsService.update(id, user.id, updateCreditCardDto);
  }

  @Delete(':id')
  remove(
    @CurrentUser() user: User,
    @Param('id') id: string,
  ): Promise<CreditCard> {
    return this.creditCardsService.remove(id, user.id);
  }
}
