import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CategoryForm } from './CategoryForm';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriesApi } from '@/lib/api';
import { toast } from 'sonner';
import type { Category, CreateCategoryDto } from '@/types';
import { useTranslation } from 'react-i18next';

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category;
}

export function CategoryDialog({
  open,
  onOpenChange,
  category,
}: CategoryDialogProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: categoriesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success(t('categories.categoryAddedSuccess'));
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || t('categories.addCategoryFailed'));
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateCategoryDto }) =>
      categoriesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success(t('categories.categoryUpdatedSuccess'));
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || t('categories.updateCategoryFailed'));
    },
  });

  const handleSubmit = (data: CreateCategoryDto) => {
    if (category) {
      updateMutation.mutate({ id: category.id, data });
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
            {category
              ? t('categories.editCategory')
              : t('categories.addCategoryDialog')}
          </DialogTitle>
        </DialogHeader>
        <CategoryForm
          category={category}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
