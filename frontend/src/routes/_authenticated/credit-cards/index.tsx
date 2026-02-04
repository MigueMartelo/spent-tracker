import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { creditCardsApi } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { CreditCardDialog } from '@/components/credit-cards/CreditCardDialog';
import { toast } from 'sonner';
import type { CreditCard } from '@/types';
import {
  ArrowLeft,
  Plus,
  CreditCard as CreditCardIcon,
  Pencil,
  Trash2,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/_authenticated/credit-cards/')({
  component: CreditCardsPage,
});

function CreditCardsPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<CreditCard | undefined>();
  const [deleteCard, setDeleteCard] = useState<CreditCard | null>(null);

  const { data: creditCards, isLoading } = useQuery({
    queryKey: ['credit-cards'],
    queryFn: creditCardsApi.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: creditCardsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credit-cards'] });
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success(t('creditCards.cardDeletedSuccess'));
      setDeleteCard(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || t('creditCards.deleteCardFailed'));
    },
  });

  const handleEdit = (card: CreditCard) => {
    setEditingCard(card);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingCard(undefined);
  };

  if (isLoading) {
    return (
      <div className='container mx-auto px-4 py-4 md:py-6 space-y-4'>
        <div className='flex items-center gap-3'>
          <Skeleton className='h-10 w-10' />
          <Skeleton className='h-8 w-48' />
        </div>
        <Skeleton className='h-20' />
        <Skeleton className='h-20' />
        <Skeleton className='h-20' />
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-4 md:py-6 space-y-4 md:space-y-6 pb-24'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <Link to='/expenses'>
            <Button variant='ghost' size='icon' className='shrink-0 h-11 w-11 sm:h-9 sm:w-9'>
              <ArrowLeft className='w-5 h-5' />
            </Button>
          </Link>
          <h1 className='text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100'>
            {t('creditCards.title')}
          </h1>
        </div>
        <Button
          onClick={() => setDialogOpen(true)}
          size='sm'
          className='gap-2 hidden md:flex'
        >
          <Plus className='w-4 h-4' />
          {t('creditCards.addCard')}
        </Button>
      </div>

      {/* Description */}
      <p className='text-sm text-slate-500 dark:text-slate-400'>
        {t('creditCards.manageCards')}
      </p>

      {/* Credit Cards List */}
      <div className='space-y-3'>
        {creditCards?.map((card) => (
          <Card
            key={card.id}
            className='hover:border-slate-300 dark:hover:border-slate-600 transition-colors'
          >
            <CardContent className='p-4'>
              <div className='flex items-center gap-4'>
                {/* Card Icon with Color */}
                <div
                  className='w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl shadow-sm shrink-0'
                  style={{ 
                    backgroundColor: card.color,
                    color: card.textColor || '#FFFFFF',
                  }}
                >
                  {card.name.charAt(0).toUpperCase()}
                </div>

                {/* Card Info */}
                <div className='flex-1 min-w-0'>
                  <p className='font-semibold text-slate-800 dark:text-slate-200 truncate'>
                    {card.name}
                  </p>
                  <p className='text-xs text-slate-500 dark:text-slate-400 font-mono'>
                    BG: {card.color} · Text: {card.textColor || '#FFFFFF'}
                  </p>
                </div>

                {/* Actions */}
                <div className='flex items-center gap-1'>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => handleEdit(card)}
                    className='text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 h-11 w-11 sm:h-9 sm:w-9'
                  >
                    <Pencil className='w-4 h-4' />
                  </Button>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => setDeleteCard(card)}
                    className='text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-500 h-11 w-11 sm:h-9 sm:w-9'
                  >
                    <Trash2 className='w-4 h-4' />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Empty State */}
        {creditCards?.length === 0 && (
          <Card className='border-dashed bg-slate-50/50 dark:bg-slate-800/50'>
            <CardContent className='p-8 text-center'>
              <div className='w-14 h-14 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4'>
                <CreditCardIcon className='w-7 h-7 text-slate-400 dark:text-slate-500' />
              </div>
              <h3 className='font-semibold text-slate-700 dark:text-slate-300 mb-1'>
                {t('creditCards.noCreditCardsYet')}
              </h3>
              <p className='text-sm text-slate-500 dark:text-slate-400 mb-4'>
                {t('creditCards.addFirstCard')}
              </p>
              <Button onClick={() => setDialogOpen(true)} className='gap-2'>
                <Plus className='w-4 h-4' />
                {t('creditCards.addCreditCard')}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Mobile FAB */}
      <Button
        onClick={() => setDialogOpen(true)}
        size='lg'
        className='md:hidden fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] right-4 z-50 h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 transition-all'
      >
        <Plus className='w-6 h-6' />
      </Button>

      {/* Credit Card Dialog */}
      <CreditCardDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        creditCard={editingCard}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteCard} onOpenChange={() => setDeleteCard(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('creditCards.deleteCard')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('creditCards.deleteCardConfirm', { name: deleteCard?.name })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteCard && deleteMutation.mutate(deleteCard.id)}
              className='bg-red-600 hover:bg-red-700'
            >
              {deleteMutation.isPending ? t('common.deleting') : t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

