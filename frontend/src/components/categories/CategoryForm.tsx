import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Category, CreateCategoryDto } from '@/types';
import { Tag, Palette, Check, Type } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

// Preset background colors for easy selection
const PRESET_COLORS = [
  '#EF4444', // Red
  '#F97316', // Orange
  '#F59E0B', // Amber
  '#EAB308', // Yellow
  '#84CC16', // Lime
  '#22C55E', // Green
  '#10B981', // Emerald
  '#14B8A6', // Teal
  '#06B6D4', // Cyan
  '#0EA5E9', // Sky
  '#3B82F6', // Blue
  '#6366F1', // Indigo
  '#8B5CF6', // Violet
  '#A855F7', // Purple
  '#D946EF', // Fuchsia
  '#EC4899', // Pink
  '#F43F5E', // Rose
  '#78716C', // Stone
  '#1F2937', // Gray dark
  '#000000', // Black
];

// Preset text colors for accessibility
const TEXT_COLORS = [
  { value: '#FFFFFF', label: 'White', bgForPreview: '#374151' },
  { value: '#000000', label: 'Black', bgForPreview: '#E5E7EB' },
  { value: '#1F2937', label: 'Dark Gray', bgForPreview: '#E5E7EB' },
  { value: '#F9FAFB', label: 'Light', bgForPreview: '#374151' },
  { value: '#FEF3C7', label: 'Cream', bgForPreview: '#374151' },
  { value: '#FECACA', label: 'Light Red', bgForPreview: '#374151' },
];

const createCategorySchema = (t: (key: string) => string) =>
  z.object({
    name: z
      .string()
      .min(1, t('categories.nameRequired'))
      .max(50, t('categories.nameMaxLength')),
    color: z
      .string()
      .regex(
        /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
        t('categories.invalidColor')
      ),
    textColor: z
      .string()
      .regex(
        /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
        t('categories.invalidTextColor')
      ),
  });

type CategoryFormData = z.infer<ReturnType<typeof createCategorySchema>>;

interface CategoryFormProps {
  category?: Category;
  onSubmit: (data: CreateCategoryDto) => void | Promise<void>;
  isSubmitting?: boolean;
  onCancel?: () => void;
}

export function CategoryForm({
  category,
  onSubmit,
  isSubmitting = false,
  onCancel,
}: CategoryFormProps) {
  const { t } = useTranslation();
  const [showCustomColor, setShowCustomColor] = useState(false);
  const [showCustomTextColor, setShowCustomTextColor] = useState(false);

  const categorySchema = createCategorySchema(t);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: category
      ? {
          name: category.name,
          color: category.color,
          textColor: category.textColor || '#FFFFFF',
        }
      : {
          name: '',
          color: PRESET_COLORS[10], // Default to blue
          textColor: '#FFFFFF', // Default to white
        },
  });

  const selectedColor = watch('color');
  const selectedTextColor = watch('textColor');

  const onFormSubmit = (data: CategoryFormData) => {
    onSubmit({
      name: data.name,
      color: data.color.toUpperCase(),
      textColor: data.textColor.toUpperCase(),
    });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className='space-y-5'>
      {/* Name Input */}
      <div className='space-y-2'>
        <Label htmlFor='name'>{t('categories.name')}</Label>
        <div className='relative'>
          <Type className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
          <Input
            id='name'
            {...register('name')}
            placeholder={t('categories.namePlaceholder')}
            className='pl-10 h-11'
            maxLength={50}
          />
        </div>
        {errors.name && (
          <p className='text-sm text-red-500'>{errors.name.message}</p>
        )}
      </div>

      {/* Preview */}
      <div className='space-y-2'>
        <Label>{t('categories.preview')}</Label>
        <div className='flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700'>
          <div
            className='w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl shadow-sm shrink-0'
            style={{
              backgroundColor: selectedColor,
              color: selectedTextColor || '#FFFFFF',
            }}
          >
            {watch('name') ? (
              watch('name').charAt(0).toUpperCase()
            ) : (
              <Tag className='w-6 h-6' />
            )}
          </div>
          <div className='flex-1 min-w-0'>
            <p className='font-semibold text-slate-800 dark:text-slate-200 truncate'>
              {watch('name') || t('categories.categoryName')}
            </p>
            <p className='text-xs text-slate-500 dark:text-slate-400 font-mono'>
              BG: {selectedColor} · Text: {selectedTextColor || '#FFFFFF'}
            </p>
          </div>
        </div>
      </div>

      {/* Background Color Selection */}
      <div className='space-y-2'>
        <Label>{t('categories.backgroundColor')}</Label>

        {/* Preset Colors Grid */}
        <div className='grid grid-cols-8 sm:grid-cols-10 gap-1.5'>
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              type='button'
              onClick={() => setValue('color', color)}
              className={`w-7 h-7 rounded-md transition-all ${
                selectedColor === color
                  ? 'ring-2 ring-offset-2 ring-slate-900 dark:ring-slate-100 scale-110'
                  : 'hover:scale-105'
              }`}
              style={{ backgroundColor: color }}
            >
              {selectedColor === color && (
                <Check className='w-4 h-4 text-white mx-auto' />
              )}
            </button>
          ))}
        </div>

        {/* Custom Color Toggle */}
        <button
          type='button'
          onClick={() => setShowCustomColor(!showCustomColor)}
          className='flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors'
        >
          <Palette className='w-4 h-4' />
          {showCustomColor
            ? t('categories.hideCustomColor')
            : t('categories.useCustomColor')}
        </button>

        {/* Custom Color Input */}
        {showCustomColor && (
          <div className='flex gap-2'>
            <Input
              {...register('color')}
              placeholder='#3B82F6'
              className='font-mono uppercase'
              maxLength={7}
            />
            <input
              type='color'
              value={selectedColor}
              onChange={(e) => setValue('color', e.target.value.toUpperCase())}
              className='w-11 h-11 rounded-md cursor-pointer border border-slate-200 dark:border-slate-700'
            />
          </div>
        )}

        {errors.color && (
          <p className='text-sm text-red-500'>{errors.color.message}</p>
        )}
      </div>

      {/* Text Color Selection */}
      <div className='space-y-2'>
        <Label>{t('categories.textColor')}</Label>

        {/* Preset Text Colors */}
        <div className='grid grid-cols-3 sm:grid-cols-6 gap-2'>
          {TEXT_COLORS.map((textColor) => (
            <button
              key={textColor.value}
              type='button'
              onClick={() => setValue('textColor', textColor.value)}
              className={`flex items-center gap-2 p-2 rounded-md border transition-all ${
                selectedTextColor === textColor.value
                  ? 'border-slate-900 dark:border-slate-100 bg-slate-50 dark:bg-slate-800'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <div
                className='w-6 h-6 rounded flex items-center justify-center text-xs font-bold'
                style={{
                  backgroundColor: textColor.bgForPreview,
                  color: textColor.value,
                }}
              >
                A
              </div>
              <span className='text-xs text-slate-600 dark:text-slate-400'>{textColor.label}</span>
            </button>
          ))}
        </div>

        {/* Custom Text Color Toggle */}
        <button
          type='button'
          onClick={() => setShowCustomTextColor(!showCustomTextColor)}
          className='flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors'
        >
          <Palette className='w-4 h-4' />
          {showCustomTextColor
            ? t('categories.hideCustomTextColor')
            : t('categories.useCustomTextColor')}
        </button>

        {/* Custom Text Color Input */}
        {showCustomTextColor && (
          <div className='flex gap-2'>
            <Input
              {...register('textColor')}
              placeholder='#FFFFFF'
              className='font-mono uppercase'
              maxLength={7}
            />
            <input
              type='color'
              value={selectedTextColor}
              onChange={(e) =>
                setValue('textColor', e.target.value.toUpperCase())
              }
              className='w-11 h-11 rounded-md cursor-pointer border border-slate-200'
            />
          </div>
        )}

        {errors.textColor && (
          <p className='text-sm text-red-500'>{errors.textColor.message}</p>
        )}
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
            : category
              ? t('categories.updateCategory')
              : t('categories.createCategory')}
        </Button>
      </div>
    </form>
  );
}
