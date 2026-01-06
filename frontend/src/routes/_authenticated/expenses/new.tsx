import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExpenseForm } from '@/components/expenses/ExpenseForm';
import { expensesApi } from '@/lib/api';
import { toast } from 'sonner';
import type { CreateExpenseDto } from '@/types';
import { ArrowLeft } from 'lucide-react';

export const Route = createFileRoute('/_authenticated/expenses/new')({
  component: NewExpensePage,
});

function NewExpensePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: createExpense, isPending } = useMutation({
    mutationFn: expensesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success('Transaction added successfully');
      navigate({ to: '/expenses' });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create transaction');
    },
  });

  const handleSubmit = (data: CreateExpenseDto) => {
    createExpense(data);
  };

  return (
    <div className='container mx-auto px-4 py-4 md:py-6 max-w-lg'>
      {/* Back Button */}
      <Link to='/expenses' className='inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 mb-4'>
        <ArrowLeft className='w-4 h-4' />
        Back to Dashboard
      </Link>

      <Card className='shadow-lg border-slate-200/50'>
        <CardHeader className='pb-4'>
          <CardTitle className='text-xl md:text-2xl'>Add Transaction</CardTitle>
        </CardHeader>
        <CardContent>
          <ExpenseForm onSubmit={handleSubmit} isSubmitting={isPending} />
        </CardContent>
      </Card>
    </div>
  );
}
