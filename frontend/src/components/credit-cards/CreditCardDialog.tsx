import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CreditCardForm } from './CreditCardForm';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { creditCardsApi } from '@/lib/api';
import { toast } from 'sonner';
import type { CreditCard, CreateCreditCardDto } from '@/types';

interface CreditCardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  creditCard?: CreditCard;
}

export function CreditCardDialog({
  open,
  onOpenChange,
  creditCard,
}: CreditCardDialogProps) {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: creditCardsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credit-cards'] });
      toast.success('Credit card added successfully');
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add credit card');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateCreditCardDto }) =>
      creditCardsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credit-cards'] });
      toast.success('Credit card updated successfully');
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update credit card');
    },
  });

  const handleSubmit = (data: CreateCreditCardDto) => {
    if (creditCard) {
      updateMutation.mutate({ id: creditCard.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>
            {creditCard ? 'Edit Credit Card' : 'Add Credit Card'}
          </DialogTitle>
        </DialogHeader>
        <CreditCardForm
          creditCard={creditCard}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

