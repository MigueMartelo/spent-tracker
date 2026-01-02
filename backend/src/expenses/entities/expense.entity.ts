export enum ExpenseType {
  INCOME = 'income',
  OUTCOME = 'outcome',
}

export class Expense {
  id: string;
  userId: string;
  type: ExpenseType;
  amount: number;
  description?: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}
