import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { CreditCard, CreateCreditCardDto } from '@/types';
import { CreditCard as CreditCardIcon, Palette, Check, Type } from 'lucide-react';
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

const createCreditCardSchema = (t: (key: string) => string) => z.object({
  name: z
    .string()
    .min(1, t('creditCards.nameRequired'))
    .max(50, t('creditCards.nameMaxLength')),
  color: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, t('creditCards.invalidColor')),
  textColor: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, t('creditCards.invalidTextColor')),
});

type CreditCardFormData = z.infer<ReturnType<typeof createCreditCardSchema>>;

interface CreditCardFormProps {
  creditCard?: CreditCard;
  onSubmit: (data: CreateCreditCardDto) => void | Promise<void>;
  isSubmitting?: boolean;
  onCancel?: () => void;
}

export function CreditCardForm({
  creditCard,
  onSubmit,
  isSubmitting = false,
  onCancel,
}: CreditCardFormProps) {
  const { t } = useTranslation();
  const [showCustomColor, setShowCustomColor] = useState(false);
  const [showCustomTextColor, setShowCustomTextColor] = useState(false);

  const creditCardSchema = createCreditCardSchema(t);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreditCardFormData>({
    resolver: zodResolver(creditCardSchema),
    defaultValues: creditCard
      ? {
          name: creditCard.name,
          color: creditCard.color,
          textColor: creditCard.textColor || '#FFFFFF',
        }
      : {
          name: '',
          color: PRESET_COLORS[10], // Default to blue
          textColor: '#FFFFFF', // Default to white
        },
  });

  const selectedColor = watch('color');
  const selectedTextColor = watch('textColor');

  const onFormSubmit = (data: CreditCardFormData) => {
    onSubmit({
      name: data.name,
      color: data.color.toUpperCase(),
      textColor: data.textColor.toUpperCase(),
    });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className='space-y-5'>
      {/* Name */}
      <div className='space-y-2'>
        <Label htmlFor='name'>{t('creditCards.cardName')}</Label>
        <div className='relative'>
          <CreditCardIcon className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
          <Input
            id='name'
            {...register('name')}
            placeholder='e.g., Chase Sapphire, Visa Gold...'
            className='pl-10 h-11'
            autoFocus
          />
        </div>
        {errors.name && (
          <p className='text-sm text-red-500'>{errors.name.message}</p>
        )}
      </div>

      {/* Preview */}
      <div className='space-y-2'>
        <Label>{t('creditCards.preview')}</Label>
        <div className='flex items-center gap-3 p-4 bg-slate-50 rounded-lg border'>
          <div
            className='w-12 h-12 rounded-xl shadow-sm flex items-center justify-center font-bold text-xl shrink-0'
            style={{ 
              backgroundColor: selectedColor,
              color: selectedTextColor,
            }}
          >
            {watch('name')?.charAt(0)?.toUpperCase() || 'C'}
          </div>
          <div className='flex-1 min-w-0'>
            <p className='text-sm font-medium text-slate-700 truncate'>
              {watch('name') || t('creditCards.cardPreview')}
            </p>
            <p className='text-xs text-slate-500'>
              Background: {selectedColor} · Text: {selectedTextColor}
            </p>
          </div>
        </div>
      </div>

      {/* Background Color Selection */}
      <div className='space-y-2'>
        <Label>{t('creditCards.backgroundColor')}</Label>

        {/* Preset Colors Grid */}
        <div className='grid grid-cols-8 sm:grid-cols-10 gap-1.5'>
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              type='button'
              onClick={() => setValue('color', color)}
              className={`w-7 h-7 rounded-md transition-all ${
                selectedColor === color
                  ? 'ring-2 ring-offset-2 ring-slate-900 scale-110'
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
          className='flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors'
        >
          <Palette className='w-4 h-4' />
          {showCustomColor ? t('creditCards.hideCustomColor') : t('creditCards.useCustomColor')}
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
              className='w-11 h-11 rounded-md cursor-pointer border border-slate-200'
            />
          </div>
        )}

        {errors.color && (
          <p className='text-sm text-red-500'>{errors.color.message}</p>
        )}
      </div>

      {/* Text Color Selection */}
      <div className='space-y-2'>
        <Label>{t('creditCards.textColor')}</Label>

        {/* Preset Text Colors */}
        <div className='flex gap-2 flex-wrap'>
          {TEXT_COLORS.map((tc) => (
            <button
              key={tc.value}
              type='button'
              onClick={() => setValue('textColor', tc.value)}
              className={`px-3 py-2 rounded-lg border transition-all flex items-center gap-2 ${
                selectedTextColor === tc.value
                  ? 'ring-2 ring-slate-900 border-slate-900'
                  : 'border-slate-200 hover:border-slate-400'
              }`}
            >
              <div
                className='w-5 h-5 rounded flex items-center justify-center font-bold text-xs'
                style={{ 
                  backgroundColor: selectedColor,
                  color: tc.value,
                }}
              >
                A
              </div>
              <span className='text-xs text-slate-600'>{tc.label}</span>
            </button>
          ))}
        </div>

        {/* Custom Text Color Toggle */}
        <button
          type='button'
          onClick={() => setShowCustomTextColor(!showCustomTextColor)}
          className='flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors'
        >
          <Type className='w-4 h-4' />
          {showCustomTextColor ? t('creditCards.hideCustomTextColor') : t('creditCards.useCustomTextColor')}
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
              onChange={(e) => setValue('textColor', e.target.value.toUpperCase())}
              className='w-11 h-11 rounded-md cursor-pointer border border-slate-200'
            />
          </div>
        )}

        {errors.textColor && (
          <p className='text-sm text-red-500'>{errors.textColor.message}</p>
        )}
      </div>

      {/* Actions */}
      <div className='flex gap-2 pt-2'>
        {onCancel && (
          <Button
            type='button'
            variant='outline'
            onClick={onCancel}
            className='flex-1 h-11'
          >
            {t('common.cancel')}
          </Button>
        )}
        <Button
          type='submit'
          disabled={isSubmitting}
          className='flex-1 h-11'
        >
          {isSubmitting
            ? t('common.saving')
            : creditCard
              ? t('creditCards.updateCard')
              : t('creditCards.addCard')}
        </Button>
      </div>
    </form>
  );
}

