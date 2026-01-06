import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExpenseForm } from '@/components/expenses/ExpenseForm';
import { expensesApi } from '@/lib/api';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import type { UpdateExpenseDto } from '@/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/_authenticated/expenses/$id')({
  component: EditExpensePage,
});

function EditExpensePage() {
  const { t } = useTranslation();
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: expense, isLoading } = useQuery({
    queryKey: ['expense', id],
    queryFn: () => expensesApi.getById(id),
  });

  const { mutate: updateExpense, isPending: isUpdating } = useMutation({
    mutationFn: (data: UpdateExpenseDto) => expensesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['expense', id] });
      toast.success(t('expenses.transactionUpdated'));
      navigate({ to: '/expenses' });
    },
    onError: (error: Error) => {
      toast.error(error.message || t('expenses.updateFailed'));
    },
  });

  const { mutate: deleteExpense, isPending: isDeleting } = useMutation({
    mutationFn: () => expensesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success(t('expenses.transactionDeleted'));
      navigate({ to: '/expenses' });
    },
    onError: (error: Error) => {
      toast.error(error.message || t('expenses.deleteFailed'));
    },
  });

  if (isLoading) {
    return (
      <div className='container mx-auto px-4 py-4 md:py-6 max-w-lg space-y-4'>
        <Skeleton className='h-6 w-32' />
        <Skeleton className='h-[400px] w-full rounded-lg' />
      </div>
    );
  }

  if (!expense) {
    return (
      <div className='container mx-auto px-4 py-4 md:py-6 max-w-lg'>
        <Card className='shadow-lg'>
          <CardContent className='p-8 text-center'>
            <div className='w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <span className='text-2xl'>🔍</span>
            </div>
            <p className='text-slate-500 mb-4'>{t('expenses.transactionNotFound')}</p>
            <Button onClick={() => navigate({ to: '/expenses' })}>
              {t('expenses.backToDashboard')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmit = (data: UpdateExpenseDto) => {
    updateExpense(data);
  };

  return (
    <div className='container mx-auto px-4 py-4 md:py-6 max-w-lg space-y-4'>
      {/* Back Button */}
      <Link to='/expenses' className='inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900'>
        <ArrowLeft className='w-4 h-4' />
        {t('expenses.backToDashboard')}
      </Link>

      {/* Edit Form */}
      <Card className='shadow-lg border-slate-200/50'>
        <CardHeader className='pb-4'>
          <CardTitle className='text-xl md:text-2xl'>{t('expenses.updateTransaction')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ExpenseForm
            expense={expense}
            onSubmit={handleSubmit}
            isSubmitting={isUpdating}
          />
        </CardContent>
      </Card>

      {/* Delete Section */}
      <Card className='border-rose-200/50 bg-rose-50/30'>
        <CardContent className='p-4'>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
            <div>
              <p className='font-medium text-rose-900'>{t('expenses.deleteTransaction')}</p>
              <p className='text-sm text-rose-700/70'>
                {t('expenses.deleteTransactionConfirm').split('.')[1]?.trim() || t('expenses.deleteTransactionConfirm')}
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant='destructive'
                  size='sm'
                  disabled={isDeleting}
                  className='gap-2 w-full sm:w-auto'
                >
                  <Trash2 className='w-4 h-4' />
                  {isDeleting ? t('common.deleting') : t('common.delete')}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className='mx-4 sm:mx-0'>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t('expenses.deleteTransaction')}?</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t('expenses.deleteTransactionConfirm')}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className='flex-col sm:flex-row gap-2'>
                  <AlertDialogCancel className='w-full sm:w-auto'>{t('common.cancel')}</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteExpense()}
                    className='bg-rose-600 hover:bg-rose-700 w-full sm:w-auto'
                  >
                    {t('common.delete')}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
