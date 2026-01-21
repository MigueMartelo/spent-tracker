import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
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
import { categoriesApi } from '@/lib/api';
import type { BudgetItem, CreateBudgetItemDto } from '@/types';
import { CategoryDialog } from '@/components/categories/CategoryDialog';
import { DollarSign, FileText, Tag, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const createBudgetItemSchema = (t: (key: string) => string) =>
  z.object({
    item: z
      .string()
      .min(1, t('budget.itemRequired'))
      .max(100, t('budget.itemMaxLength')),
    amount: z.number().min(0.01, t('budget.amountRequired')),
    categoryId: z.string().optional(),
  });

type BudgetItemFormData = z.infer<ReturnType<typeof createBudgetItemSchema>>;

interface BudgetItemFormProps {
  budgetItem?: BudgetItem;
  onSubmit: (data: CreateBudgetItemDto) => void | Promise<void>;
  isSubmitting?: boolean;
  onCancel?: () => void;
}

export function BudgetItemForm({
  budgetItem,
  onSubmit,
  isSubmitting = false,
  onCancel,
}: BudgetItemFormProps) {
  const { t } = useTranslation();
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getAll,
  });

  const budgetItemSchema = createBudgetItemSchema(t);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BudgetItemFormData>({
    resolver: zodResolver(budgetItemSchema),
    defaultValues: budgetItem
      ? {
          item: budgetItem.item,
          amount: Number(budgetItem.amount),
          categoryId: budgetItem.categoryId || undefined,
        }
      : {
          item: '',
          amount: undefined,
          categoryId: undefined,
        },
  });

  const selectedCategoryId = watch('categoryId');

  const onFormSubmit = (data: BudgetItemFormData) => {
    onSubmit({
      item: data.item,
      amount: data.amount,
      categoryId: data.categoryId,
    });
  };

  const selectedCategory = categories.find(
    (category) => category.id === selectedCategoryId
  );

  return (
    <>
      <form onSubmit={handleSubmit(onFormSubmit)} className='space-y-5'>
        {/* Item */}
        <div className='space-y-2'>
          <Label htmlFor='item'>{t('budget.item')}</Label>
          <div className='relative'>
            <FileText className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
            <Input
              id='item'
              {...register('item')}
              placeholder={t('budget.itemPlaceholder')}
              className='pl-10 h-11'
              maxLength={100}
            />
          </div>
          {errors.item && (
            <p className='text-sm text-red-500'>{errors.item.message}</p>
          )}
        </div>

        {/* Amount */}
        <div className='space-y-2'>
          <Label htmlFor='amount'>{t('budget.amount')}</Label>
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

        {/* Category */}
        <div className='space-y-3 pt-2'>
          <div className='space-y-2'>
            <Label htmlFor='category'>{t('budget.category')}</Label>
            {categories.length > 0 ? (
              <Select
                value={selectedCategoryId || '__none__'}
                onValueChange={(value) =>
                  setValue(
                    'categoryId',
                    value === '__none__' ? undefined : value
                  )
                }
              >
                <SelectTrigger className='h-11'>
                  <SelectValue placeholder={t('budget.selectCategory')}>
                    {selectedCategory && (
                      <div className='flex items-center gap-2'>
                        <div
                          className='w-6 h-6 rounded flex items-center justify-center text-xs font-bold'
                          style={{
                            backgroundColor: selectedCategory.color,
                            color: selectedCategory.textColor || '#FFFFFF',
                          }}
                        >
                          {selectedCategory.name.charAt(0).toUpperCase()}
                        </div>
                        <span>{selectedCategory.name}</span>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='__none__'>
                    <span className='text-slate-400'>
                      {t('budget.noCategory')}
                    </span>
                  </SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className='flex items-center gap-2'>
                        <div
                          className='w-6 h-6 rounded flex items-center justify-center text-xs font-bold'
                          style={{
                            backgroundColor: category.color,
                            color: category.textColor || '#FFFFFF',
                          }}
                        >
                          {category.name.charAt(0).toUpperCase()}
                        </div>
                        <span>{category.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className='flex items-center gap-2 text-sm text-slate-500'>
                <Tag className='w-4 h-4' />
                <span>{t('budget.noCategories')}</span>
              </div>
            )}

            <button
              type='button'
              onClick={() => setCategoryDialogOpen(true)}
              className='flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 transition-colors'
            >
              <Plus className='w-3.5 h-3.5' />
              {t('budget.addNewCategory')}
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex gap-3 pt-2'>
          {onCancel && (
            <Button
              type='button'
              variant='outline'
              onClick={onCancel}
              className='flex-1 h-11'
              disabled={isSubmitting}
            >
              {t('common.cancel')}
            </Button>
          )}
          <Button type='submit' disabled={isSubmitting} className='flex-1 h-11'>
            {isSubmitting
              ? t('common.saving')
              : budgetItem
                ? t('budget.updateItem')
                : t('budget.addItem')}
          </Button>
        </div>
      </form>

      <CategoryDialog
        open={categoryDialogOpen}
        onOpenChange={setCategoryDialogOpen}
      />
    </>
  );
}
