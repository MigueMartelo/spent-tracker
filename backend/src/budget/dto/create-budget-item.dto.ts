import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  MinLength,
} from 'class-validator';

export class CreateBudgetItemDto {
  @IsString()
  @MinLength(1, { message: 'Item is required' })
  item: string;

  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsOptional()
  @IsUUID()
  categoryId?: string | null;
}
