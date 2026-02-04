import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { expensesApi } from '@/lib/api';
import { formatCurrency, formatCurrencyWithSign } from '@/lib/currency';
import { ExpenseType } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { CreditCardBadge } from '@/components/credit-cards/CreditCardBadge';
import { CategoryBadge } from '@/components/categories/CategoryBadge';
import { format } from 'date-fns';
import { Link } from '@tanstack/react-router';
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Wallet,
  ChevronRight,
  Calendar,
  History,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/_authenticated/expenses/')({
  component: ExpensesPage,
});

function ExpensesPage() {
  const { t } = useTranslation();
  const { type } = Route.useSearch() as { type: ExpenseType | undefined };
  const expenseType = type;

  const { data: expenses, isLoading } = useQuery({
    queryKey: ['expenses', { type: expenseType }],
    queryFn: () =>
      expensesApi.getAll(expenseType ? { type: expenseType } : undefined),
  });

  // Get current date info
  const now = new Date();
  const currentMonthName = format(now, 'MMMM yyyy');
  const todayString = format(now, 'yyyy-MM-dd');
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  // Helper to parse expense date as LOCAL date (avoiding timezone issues)
  // The backend stores dates as "2026-01-05T00:00:00.000Z" but we want to treat as local date
  const parseLocalDate = (dateValue: string): Date => {
    // Extract YYYY-MM-DD and parse as local date
    const dateStr = dateValue.substring(0, 10);
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  // Helper to extract date string from expense date (YYYY-MM-DD)
  const getDateString = (dateValue: string): string => {
    return dateValue.substring(0, 10);
  };

  // Filter expenses for current month (for summary cards)
  const currentMonthExpenses = expenses?.filter((expense) => {
    const dateStr = getDateString(expense.date);
    const [year, month] = dateStr.split('-').map(Number);
    return year === currentYear && month === currentMonth + 1;
  });

  // Get today's expenses sorted by date/time (most recent first)
  const recentExpenses = expenses
    ?.filter((expense) => {
      const dateStr = getDateString(expense.date);
      return dateStr === todayString;
    })
    .slice()
    .sort((a, b) => {
      // First sort by transaction date/time (most recent first)
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      if (dateB !== dateA) return dateB - dateA;
      // If same date/time, sort by createdAt (most recent first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const monthlyTotals = currentMonthExpenses?.reduce(
    (acc, expense) => {
      if (expense.type === ExpenseType.INCOME) {
        acc.income += Number(expense.amount);
      } else {
        acc.outcome += Number(expense.amount);
      }
      return acc;
    },
    { income: 0, outcome: 0 }
  ) || { income: 0, outcome: 0 };

  const monthlyBalance = monthlyTotals.income - monthlyTotals.outcome;

  // Calculate today's outcomes
  const todayOutcomes =
    expenses
      ?.filter((expense) => {
        const dateStr = getDateString(expense.date);
        return dateStr === todayString && expense.type === ExpenseType.OUTCOME;
      })
      .reduce((total, expense) => total + Number(expense.amount), 0) || 0;

  if (isLoading) {
    return (
      <div className='container mx-auto px-4 py-4 md:py-6 space-y-4'>
        <Skeleton className='h-8 w-48' />
        <Skeleton className='h-6 w-32' />
        <div className='grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4'>
          <Skeleton className='h-20 md:h-28' />
          <Skeleton className='h-20 md:h-28' />
          <Skeleton className='h-20 md:h-28' />
          <Skeleton className='h-20 md:h-28' />
        </div>
        <Skeleton className='h-24' />
        <Skeleton className='h-24' />
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-4 md:py-6 space-y-4 md:space-y-6'>
      {/* Header */}
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100'>
          {t('expenses.dashboard')}
        </h1>
        <div className='flex items-center gap-2'>
          {/* History Button */}
          <Link to='/expenses/history'>
            <Button variant='outline' size='sm' className='gap-2'>
              <History className='w-4 h-4' />
              <span>{t('expenses.history')}</span>
            </Button>
          </Link>
          {/* Desktop Add Button */}
          <Link to='/expenses/new' className='hidden md:block'>
            <Button className='gap-2'>
              <Plus className='w-4 h-4' />
              {t('expenses.addExpense')}
            </Button>
          </Link>
        </div>
      </div>

      {/* Current Day Indicator */}
      <div className='flex items-center justify-between gap-2'>
        <div className='flex items-center gap-2 text-slate-600 dark:text-slate-300'>
          <Calendar className='w-4 h-4' />
          <span className='text-sm font-medium'>
            {format(now, 'EEEE, MMMM dd, yyyy')}
          </span>
        </div>
        {/* Mobile Add Button */}
        <Link to='/expenses/new' className='md:hidden'>
          <Button size='sm' className='gap-1.5'>
            <Plus className='w-4 h-4' />
            {t('expenses.addExpense')}
          </Button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4'>
        {/* Today's Outcomes Card */}
        <Card className='bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200/50 dark:border-orange-800/50'>
          <CardContent className='p-4 md:p-6'>
            <div className='flex items-center gap-1.5 md:gap-2 mb-1 md:mb-2'>
              <div className='p-1 md:p-1.5 bg-orange-500/10 dark:bg-orange-500/20 rounded-md'>
                <TrendingDown className='w-3 h-3 md:w-4 md:h-4 text-orange-600 dark:text-orange-500' />
              </div>
              <span className='text-xs md:text-sm font-medium text-orange-700 dark:text-orange-400'>
                {t('common.today')}
              </span>
            </div>
            <p className='text-base md:text-2xl font-bold text-orange-700 dark:text-orange-400 truncate'>
              {formatCurrency(todayOutcomes)}
            </p>
            <p className='text-xs text-orange-600/70 dark:text-orange-500/70 mt-0.5'>
              {t('expenses.spentToday')}
            </p>
          </CardContent>
        </Card>

        {/* Monthly Income Card */}
        <Card className='bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-800/20 border-emerald-200/50 dark:border-emerald-800/50'>
          <CardContent className='p-4 md:p-6'>
            <div className='flex items-center gap-1.5 md:gap-2 mb-1 md:mb-2'>
              <div className='p-1 md:p-1.5 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-md'>
                <TrendingUp className='w-3 h-3 md:w-4 md:h-4 text-emerald-600 dark:text-emerald-500' />
              </div>
              <span className='text-xs md:text-sm font-medium text-emerald-700 dark:text-emerald-400'>
                {t('expenses.income')}
              </span>
            </div>
            <p className='text-base md:text-2xl font-bold text-emerald-700 dark:text-emerald-400 truncate'>
              {formatCurrency(monthlyTotals.income)}
            </p>
            <p className='text-xs text-emerald-600/70 dark:text-emerald-500/70 mt-0.5'>
              {t('common.thisMonth')}
            </p>
          </CardContent>
        </Card>

        {/* Monthly Expenses Card */}
        <Card className='bg-gradient-to-br from-rose-50 to-rose-100/50 dark:from-rose-900/20 dark:to-rose-800/20 border-rose-200/50 dark:border-rose-800/50'>
          <CardContent className='p-4 md:p-6'>
            <div className='flex items-center gap-1.5 md:gap-2 mb-1 md:mb-2'>
              <div className='p-1 md:p-1.5 bg-rose-500/10 dark:bg-rose-500/20 rounded-md'>
                <TrendingDown className='w-3 h-3 md:w-4 md:h-4 text-rose-600 dark:text-rose-500' />
              </div>
              <span className='text-xs md:text-sm font-medium text-rose-700 dark:text-rose-400'>
                {t('expenses.expense')}
              </span>
            </div>
            <p className='text-base md:text-2xl font-bold text-rose-700 dark:text-rose-400 truncate'>
              {formatCurrency(monthlyTotals.outcome)}
            </p>
            <p className='text-xs text-rose-600/70 dark:text-rose-500/70 mt-0.5'>
              {t('common.thisMonth')}
            </p>
          </CardContent>
        </Card>

        {/* Balance Card */}
        <Card
          className={`bg-gradient-to-br ${
            monthlyBalance >= 0
              ? 'from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200/50 dark:border-blue-800/50'
              : 'from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200/50 dark:border-amber-800/50'
          }`}
        >
          <CardContent className='p-4 md:p-6'>
            <div className='flex items-center gap-1.5 md:gap-2 mb-1 md:mb-2'>
              <div
                className={`p-1 md:p-1.5 rounded-md ${
                  monthlyBalance >= 0 ? 'bg-blue-500/10 dark:bg-blue-500/20' : 'bg-amber-500/10 dark:bg-amber-500/20'
                }`}
              >
                <Wallet
                  className={`w-3 h-3 md:w-4 md:h-4 ${
                    monthlyBalance >= 0 ? 'text-blue-600 dark:text-blue-500' : 'text-amber-600 dark:text-amber-500'
                  }`}
                />
              </div>
              <span
                className={`text-xs md:text-sm font-medium ${
                  monthlyBalance >= 0 ? 'text-blue-700 dark:text-blue-400' : 'text-amber-700 dark:text-amber-400'
                }`}
              >
                {t('expenses.balance')}
              </span>
            </div>
            <p
              className={`text-base md:text-2xl font-bold truncate ${
                monthlyBalance >= 0 ? 'text-blue-700 dark:text-blue-400' : 'text-amber-700 dark:text-amber-400'
              }`}
            >
              {monthlyBalance >= 0 ? '' : '-'}
              {formatCurrency(Math.abs(monthlyBalance))}
            </p>
            <p
              className={`text-xs mt-0.5 ${
                monthlyBalance >= 0 ? 'text-blue-600/70 dark:text-blue-500/70' : 'text-amber-600/70 dark:text-amber-500/70'
              }`}
            >
              {t('common.thisMonth')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Buttons */}
      <div className='flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide'>
        <Link to='/expenses' search={{ type: undefined }}>
          <Button
            variant={!expenseType ? 'default' : 'outline'}
            size='sm'
            className='whitespace-nowrap'
          >
            {t('common.all')}
          </Button>
        </Link>
        <Link to='/expenses' search={{ type: ExpenseType.INCOME }}>
          <Button
            variant={expenseType === ExpenseType.INCOME ? 'default' : 'outline'}
            size='sm'
            className='whitespace-nowrap gap-1.5'
          >
            <TrendingUp className='w-3.5 h-3.5' />
            {t('expenses.income')}
          </Button>
        </Link>
        <Link to='/expenses' search={{ type: ExpenseType.OUTCOME }}>
          <Button
            variant={
              expenseType === ExpenseType.OUTCOME ? 'default' : 'outline'
            }
            size='sm'
            className='whitespace-nowrap gap-1.5'
          >
            <TrendingDown className='w-3.5 h-3.5' />
            {t('expenses.expense')}
          </Button>
        </Link>
      </div>

      {/* Today's Transactions */}
      <div className='space-y-2 md:space-y-3'>
        <h2 className='text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider'>
          {t('expenses.todaysTransactions')}
        </h2>

        {recentExpenses?.map((expense) => (
          <Link
            key={expense.id}
            to='/expenses/$id'
            params={{ id: expense.id }}
            className='block'
          >
            <Card className='hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-colors cursor-pointer active:scale-[0.99] touch-manipulation'>
              <CardContent className='p-4 md:p-4'>
                <div className='flex items-start gap-3'>
                  {/* Icon */}
                  <div
                    className={`p-2 md:p-2.5 rounded-xl shrink-0 ${
                      expense.type === ExpenseType.INCOME
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-500'
                        : 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-500'
                    }`}
                  >
                    {expense.type === ExpenseType.INCOME ? (
                      <TrendingUp className='w-4 h-4 md:w-5 md:h-5' />
                    ) : (
                      <TrendingDown className='w-4 h-4 md:w-5 md:h-5' />
                    )}
                  </div>

                  {/* Content */}
                  <div className='flex-1 min-w-0'>
                    {/* Badges and Metadata - Top row */}
                    <div className='flex flex-wrap items-center gap-1.5 md:gap-2 mb-1 md:mb-0.5'>
                      <Badge
                        variant={
                          expense.type === ExpenseType.INCOME
                            ? 'default'
                            : 'destructive'
                        }
                        className='text-xs px-1.5 py-0 shrink-0'
                      >
                        {expense.type}
                      </Badge>
                      {expense.creditCard && (
                        <div className='shrink-0'>
                          <CreditCardBadge
                            creditCard={expense.creditCard}
                            size='sm'
                          />
                        </div>
                      )}
                      {expense.category && (
                        <div className='shrink-0'>
                          <CategoryBadge
                            category={expense.category}
                            size='sm'
                          />
                        </div>
                      )}
                      <span className='text-xs text-slate-500 dark:text-slate-400 shrink-0'>
                        {format(parseLocalDate(expense.date), 'MMM dd')}
                      </span>
                    </div>

                    {/* Description - Mobile: Full width with amount, Desktop: Left */}
                    <div className='flex items-start justify-between gap-2'>
                      <p className='text-sm md:text-sm font-medium text-slate-800 dark:text-slate-200 flex-1 min-w-0'>
                        {expense.description}
                      </p>
                      {/* Amount - Mobile: Right side, Desktop: Hidden (shown in right column) */}
                      <div className='flex items-center gap-1.5 shrink-0 md:hidden'>
                        <p
                          className={`text-base font-semibold ${
                            expense.type === ExpenseType.INCOME
                              ? 'text-emerald-600 dark:text-emerald-500'
                              : 'text-rose-600 dark:text-rose-500'
                          }`}
                        >
                          {formatCurrencyWithSign(
                            Number(expense.amount),
                            expense.type === ExpenseType.INCOME
                              ? 'income'
                              : 'outcome'
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Amount & Arrow - Desktop only */}
                  <div className='hidden md:flex items-center gap-2 shrink-0'>
                    <p
                      className={`text-lg font-semibold ${
                        expense.type === ExpenseType.INCOME
                          ? 'text-emerald-600 dark:text-emerald-500'
                          : 'text-rose-600 dark:text-rose-500'
                      }`}
                    >
                      {formatCurrencyWithSign(
                        Number(expense.amount),
                        expense.type === ExpenseType.INCOME
                          ? 'income'
                          : 'outcome'
                      )}
                    </p>
                    <ChevronRight className='w-4 h-4 text-slate-400 dark:text-slate-500' />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}

        {recentExpenses?.length === 0 && (
          <Card className='border-dashed bg-slate-50/50 dark:bg-slate-800/50'>
            <CardContent className='p-6 md:p-8 text-center'>
              <div className='w-10 h-10 md:w-12 md:h-12 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-3'>
                <Calendar className='w-5 h-5 md:w-6 md:h-6 text-slate-400 dark:text-slate-500' />
              </div>
              <p className='text-slate-500 dark:text-slate-400 text-sm mb-3'>
                {t('expenses.noTransactionsToday')}
              </p>
              <Link to='/expenses/new'>
                <Button size='sm' variant='outline' className='gap-2'>
                  <Plus className='w-4 h-4' />
                  {t('expenses.addTransaction')}
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

    </div>
  );
}
