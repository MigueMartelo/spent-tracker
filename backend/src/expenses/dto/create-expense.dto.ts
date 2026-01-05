import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ExpenseType } from '../entities/expense.entity';

export class CreateExpenseDto {
  @IsEnum(ExpenseType)
  type: ExpenseType;

  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  date: string;
}
