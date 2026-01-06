import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { categoriesApi } from '@/lib/api';
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
import { CategoryDialog } from '@/components/categories/CategoryDialog';
import { toast } from 'sonner';
import type { Category } from '@/types';
import { ArrowLeft, Plus, Tag, Pencil, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/_authenticated/categories/')({
  component: CategoriesPage,
});

function CategoriesPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<
    Category | undefined
  >();
  const [deleteCategory, setDeleteCategory] = useState<Category | null>(null);

  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: categoriesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success('Category deleted successfully');
      setDeleteCategory(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete category');
    },
  });

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingCategory(undefined);
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
            <Button
              variant='ghost'
              size='icon'
              className='shrink-0 h-11 w-11 sm:h-9 sm:w-9'
            >
              <ArrowLeft className='w-5 h-5' />
            </Button>
          </Link>
          <h1 className='text-xl md:text-2xl font-bold text-slate-800'>
            Categories
          </h1>
        </div>
        <Button
          onClick={() => setDialogOpen(true)}
          size='sm'
          className='gap-2 hidden md:flex'
        >
          <Plus className='w-4 h-4' />
          Add Category
        </Button>
      </div>

      {/* Description */}
      <p className='text-sm text-slate-500'>
        Organize your expenses by creating custom categories with colors.
      </p>

      {/* Categories List */}
      <div className='space-y-3'>
        {categories?.map((category) => (
          <Card
            key={category.id}
            className='hover:border-slate-300 transition-colors'
          >
            <CardContent className='p-4'>
              <div className='flex items-center gap-4'>
                {/* Category Icon with Color */}
                <div
                  className='w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl shadow-sm shrink-0'
                  style={{
                    backgroundColor: category.color,
                    color: category.textColor || '#FFFFFF',
                  }}
                >
                  {category.name.charAt(0).toUpperCase()}
                </div>

                {/* Category Info */}
                <div className='flex-1 min-w-0'>
                  <p className='font-semibold text-slate-800 truncate'>
                    {category.name}
                  </p>
                  <p className='text-xs text-slate-500 font-mono'>
                    BG: {category.color} · Text:{' '}
                    {category.textColor || '#FFFFFF'}
                  </p>
                </div>

                {/* Actions */}
                <div className='flex items-center gap-1'>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => handleEdit(category)}
                    className='text-slate-500 hover:text-slate-700 h-11 w-11 sm:h-9 sm:w-9'
                  >
                    <Pencil className='w-4 h-4' />
                  </Button>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => setDeleteCategory(category)}
                    className='text-slate-500 hover:text-red-600 h-11 w-11 sm:h-9 sm:w-9'
                  >
                    <Trash2 className='w-4 h-4' />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Empty State */}
        {categories?.length === 0 && (
          <Card className='border-dashed bg-slate-50/50'>
            <CardContent className='p-8 text-center'>
              <div className='w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <Tag className='w-7 h-7 text-slate-400' />
              </div>
              <h3 className='font-semibold text-slate-700 mb-1'>
                No categories yet
              </h3>
              <p className='text-sm text-slate-500 mb-4'>
                Create your first category to organize expenses
              </p>
              <Button onClick={() => setDialogOpen(true)} className='gap-2'>
                <Plus className='w-4 h-4' />
                Add Category
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

      {/* Category Dialog */}
      <CategoryDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        category={editingCategory}
      />

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteCategory}
        onOpenChange={() => setDeleteCategory(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteCategory?.name}"? This
              will remove the category from all expenses, but won't delete the
              expenses themselves.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deleteCategory && deleteMutation.mutate(deleteCategory.id)
              }
              className='bg-red-600 hover:bg-red-700'
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
