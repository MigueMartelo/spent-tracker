import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  MinLength,
} from 'class-validator';
import { ExpenseType } from '../entities/expense.entity';

export class CreateExpenseDto {
  @IsEnum(ExpenseType)
  type: ExpenseType;

  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsString()
  @MinLength(1, { message: 'Description is required' })
  description: string;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsUUID()
  creditCardId?: string;
}
