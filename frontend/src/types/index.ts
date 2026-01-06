// Match backend DTOs and Prisma models

export enum ExpenseType {
  INCOME = 'income',
  OUTCOME = 'outcome',
}

export interface User {
  id: string;
  email: string;
  name: string | null;
}

export interface CreditCard {
  id: string;
  userId: string;
  name: string;
  color: string;
  textColor: string;
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  id: string;
  userId: string;
  type: ExpenseType;
  amount: number;
  description: string;
  date: string; // ISO date string
  creditCardId: string | null;
  creditCard: CreditCard | null;
  createdAt: string;
  updatedAt: string;
}

// Request DTOs
export interface RegisterDto {
  email: string;
  password: string;
  name?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface CreateExpenseDto {
  type: ExpenseType;
  amount: number;
  description: string;
  date: string;
  creditCardId?: string;
}

export interface UpdateExpenseDto extends Partial<CreateExpenseDto> {}

export interface CreateCreditCardDto {
  name: string;
  color: string;
  textColor?: string;
}

export interface UpdateCreditCardDto extends Partial<CreateCreditCardDto> {}

export interface ExpenseFilters {
  type?: ExpenseType;
  creditCardId?: string; // 'none' for expenses without credit card
}

// Response types
export interface AuthResponse {
  access_token: string;
  user: Partial<User>;
}

