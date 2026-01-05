import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ExpenseType } from './entities/expense.entity';

@Injectable()
export class ExpensesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createExpenseDto: CreateExpenseDto) {
    return this.prisma.expense.create({
      data: {
        userId,
        type: createExpenseDto.type,
        amount: createExpenseDto.amount,
        description: createExpenseDto.description,
        date: new Date(createExpenseDto.date),
      },
    });
  }

  async findAll(userId: string, type?: ExpenseType) {
    const where: Prisma.ExpenseWhereInput = { userId };
    if (type) {
      where.type = type;
    }

    return this.prisma.expense.findMany({
      where,
      orderBy: {
        date: 'desc',
      },
    });
  }

  async findOne(id: string, userId: string) {
    const expense = await this.prisma.expense.findUnique({
      where: { id },
    });

    if (!expense) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }

    if (expense.userId !== userId) {
      throw new ForbiddenException('You do not have access to this expense');
    }

    return expense;
  }

  async update(id: string, userId: string, updateExpenseDto: UpdateExpenseDto) {
    // Verify ownership
    await this.findOne(id, userId);

    const updateData: Prisma.ExpenseUpdateInput = {};
    if (updateExpenseDto.type) updateData.type = updateExpenseDto.type;
    if (updateExpenseDto.amount) updateData.amount = updateExpenseDto.amount;
    if (updateExpenseDto.description !== undefined)
      updateData.description = updateExpenseDto.description;
    if (updateExpenseDto.date)
      updateData.date = new Date(updateExpenseDto.date);

    return this.prisma.expense.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string, userId: string) {
    // Verify ownership
    await this.findOne(id, userId);

    return this.prisma.expense.delete({
      where: { id },
    });
  }
}
