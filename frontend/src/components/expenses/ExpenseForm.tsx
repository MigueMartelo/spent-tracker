import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ExpenseType, type Expense, type CreateExpenseDto } from '@/types';
import { creditCardsApi } from '@/lib/api';
import { CreditCardDialog } from '@/components/credit-cards/CreditCardDialog';
import { format } from 'date-fns';
import {
  DollarSign,
  FileText,
  Calendar,
  TrendingUp,
  TrendingDown,
  CreditCard as CreditCardIcon,
  Plus,
} from 'lucide-react';

const expenseSchema = z.object({
  type: z.nativeEnum(ExpenseType),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  description: z.string().min(1, 'Description is required'),
  date: z.string().min(1, 'Date is required'),
  creditCardId: z.string().optional(),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

interface ExpenseFormProps {
  expense?: Expense;
  onSubmit: (data: CreateExpenseDto) => void | Promise<void>;
  isSubmitting?: boolean;
}

export function ExpenseForm({
  expense,
  onSubmit,
  isSubmitting = false,
}: ExpenseFormProps) {
  const [useCreditCard, setUseCreditCard] = useState(
    expense?.creditCardId ? true : false
  );
  const [creditCardDialogOpen, setCreditCardDialogOpen] = useState(false);

  const { data: creditCards = [] } = useQuery({
    queryKey: ['credit-cards'],
    queryFn: creditCardsApi.getAll,
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: expense
      ? {
          type: expense.type,
          amount: Number(expense.amount),
          description: expense.description,
          date: format(new Date(expense.date), 'yyyy-MM-dd'),
          creditCardId: expense.creditCardId || undefined,
        }
      : {
          type: ExpenseType.OUTCOME,
          date: format(new Date(), 'yyyy-MM-dd'),
          description: '',
        },
  });

  const type = watch('type');
  const selectedCreditCardId = watch('creditCardId');

  // Reset credit card when switching to income
  useEffect(() => {
    if (type === ExpenseType.INCOME) {
      setUseCreditCard(false);
      setValue('creditCardId', undefined);
    }
  }, [type, setValue]);

  // Reset credit card when toggle is off
  useEffect(() => {
    if (!useCreditCard) {
      setValue('creditCardId', undefined);
    }
  }, [useCreditCard, setValue]);

  const onFormSubmit = (data: ExpenseFormData) => {
    onSubmit({
      type: data.type,
      amount: data.amount,
      description: data.description,
      date: new Date(data.date).toISOString(),
      creditCardId: useCreditCard ? data.creditCardId : undefined,
    });
  };

  const selectedCard = creditCards.find(
    (card) => card.id === selectedCreditCardId
  );

  return (
    <>
      <form onSubmit={handleSubmit(onFormSubmit)} className='space-y-5'>
        {/* Type Selection */}
        <div className='space-y-2'>
          <Label htmlFor='type'>Transaction Type</Label>
          <Select
            value={type}
            onValueChange={(value) => setValue('type', value as ExpenseType)}
          >
            <SelectTrigger className='h-11'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ExpenseType.INCOME}>
                <div className='flex items-center gap-2'>
                  <TrendingUp className='w-4 h-4 text-emerald-600' />
                  <span>Income</span>
                </div>
              </SelectItem>
              <SelectItem value={ExpenseType.OUTCOME}>
                <div className='flex items-center gap-2'>
                  <TrendingDown className='w-4 h-4 text-rose-600' />
                  <span>Expense</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          {errors.type && (
            <p className='text-sm text-red-500'>{errors.type.message}</p>
          )}
        </div>

        {/* Amount */}
        <div className='space-y-2'>
          <Label htmlFor='amount'>Amount</Label>
          <div className='relative'>
            <DollarSign className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
            <Input
              id='amount'
              type='number'
              step='0.01'
              placeholder='0.00'
              className='pl-10 h-11 text-lg'
              {...register('amount', { valueAsNumber: true })}
            />
          </div>
          {errors.amount && (
            <p className='text-sm text-red-500'>{errors.amount.message}</p>
          )}
        </div>

        {/* Description */}
        <div className='space-y-2'>
          <Label htmlFor='description'>Description</Label>
          <div className='relative'>
            <FileText className='absolute left-3 top-3 w-4 h-4 text-slate-400' />
            <Input
              id='description'
              {...register('description')}
              placeholder='What is this for?'
              className='pl-10 h-11'
            />
          </div>
          {errors.description && (
            <p className='text-sm text-red-500'>{errors.description.message}</p>
          )}
        </div>

        {/* Date */}
        <div className='space-y-2'>
          <Label htmlFor='date'>Date</Label>
          <div className='relative'>
            <Calendar className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
            <Input
              id='date'
              type='date'
              className='pl-10 h-11'
              {...register('date')}
            />
          </div>
          {errors.date && (
            <p className='text-sm text-red-500'>{errors.date.message}</p>
          )}
        </div>

        {/* Credit Card Section - Only for Outcome */}
        {type === ExpenseType.OUTCOME && (
          <div className='space-y-3 pt-2'>
            {/* Toggle */}
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <CreditCardIcon className='w-4 h-4 text-slate-500' />
                <Label
                  htmlFor='use-credit-card'
                  className='font-medium cursor-pointer'
                >
                  Pay with credit card
                </Label>
              </div>
              <Switch
                id='use-credit-card'
                checked={useCreditCard}
                onCheckedChange={setUseCreditCard}
              />
            </div>

            {/* Credit Card Selection */}
            {useCreditCard && (
              <div className='space-y-2 pl-6'>
                {creditCards.length > 0 ? (
                  <Select
                    value={selectedCreditCardId || ''}
                    onValueChange={(value) => setValue('creditCardId', value)}
                  >
                    <SelectTrigger className='h-11'>
                      <SelectValue placeholder='Select a credit card'>
                        {selectedCard && (
                          <div className='flex items-center gap-2'>
                            <div
                              className='w-6 h-6 rounded flex items-center justify-center text-xs font-bold'
                              style={{
                                backgroundColor: selectedCard.color,
                                color: selectedCard.textColor || '#FFFFFF',
                              }}
                            >
                              {selectedCard.name.charAt(0).toUpperCase()}
                            </div>
                            <span>{selectedCard.name}</span>
                          </div>
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {creditCards.map((card) => (
                        <SelectItem key={card.id} value={card.id}>
                          <div className='flex items-center gap-2'>
                            <div
                              className='w-6 h-6 rounded flex items-center justify-center text-xs font-bold'
                              style={{
                                backgroundColor: card.color,
                                color: card.textColor || '#FFFFFF',
                              }}
                            >
                              {card.name.charAt(0).toUpperCase()}
                            </div>
                            <span>{card.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className='flex flex-col gap-2'>
                    <p className='text-sm text-slate-500'>
                      No credit cards added yet.
                    </p>
                  </div>
                )}

                {/* Add new credit card */}
                <button
                  type='button'
                  onClick={() => setCreditCardDialogOpen(true)}
                  className='flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 transition-colors'
                >
                  <Plus className='w-3.5 h-3.5' />
                  Add new credit card
                </button>
              </div>
            )}
          </div>
        )}

        {/* Submit Button */}
        <Button
          type='submit'
          disabled={isSubmitting}
          className='w-full h-12 text-base mt-6'
        >
          {isSubmitting
            ? 'Saving...'
            : expense
              ? 'Update Transaction'
              : 'Add Transaction'}
        </Button>
      </form>

      {/* Credit Card Dialog */}
      <CreditCardDialog
        open={creditCardDialogOpen}
        onOpenChange={setCreditCardDialogOpen}
      />
    </>
  );
}
