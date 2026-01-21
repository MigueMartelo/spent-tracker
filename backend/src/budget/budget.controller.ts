import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { type User } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { BudgetService } from './budget.service';
import { CreateBudgetItemDto } from './dto/create-budget-item.dto';
import { UpdateBudgetItemDto } from './dto/update-budget-item.dto';

@Controller('budget')
@UseGuards(JwtAuthGuard)
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Get()
  getBudget(@CurrentUser() user: User) {
    return this.budgetService.getBudget(user.id);
  }

  @Post('items')
  createItem(
    @CurrentUser() user: User,
    @Body() createBudgetItemDto: CreateBudgetItemDto,
  ) {
    return this.budgetService.createItem(user.id, createBudgetItemDto);
  }

  @Patch('items/:id')
  updateItem(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() updateBudgetItemDto: UpdateBudgetItemDto,
  ) {
    return this.budgetService.updateItem(id, user.id, updateBudgetItemDto);
  }

  @Delete('items/:id')
  removeItem(@CurrentUser() user: User, @Param('id') id: string) {
    return this.budgetService.removeItem(id, user.id);
  }
}
