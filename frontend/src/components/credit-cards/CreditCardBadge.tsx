import { CreditCard } from '@/types';
import { CreditCard as CreditCardIcon } from 'lucide-react';

interface CreditCardBadgeProps {
  creditCard: CreditCard;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
}

export function CreditCardBadge({
  creditCard,
  size = 'md',
  showName = true,
}: CreditCardBadgeProps) {
  const initial = creditCard.name.charAt(0).toUpperCase();
  
  const sizeClasses = {
    sm: 'w-5 h-5 text-xs',
    md: 'w-6 h-6 text-xs',
    lg: 'w-8 h-8 text-sm',
  }[size];

  const nameSizeClasses = {
    sm: 'text-xs max-w-[60px]',
    md: 'text-xs max-w-[80px]',
    lg: 'text-sm max-w-[100px]',
  }[size];

  return (
    <div className='flex items-center gap-1.5'>
      <div
        className={`${sizeClasses} rounded flex items-center justify-center font-bold shadow-sm shrink-0`}
        style={{ 
          backgroundColor: creditCard.color,
          color: creditCard.textColor || '#FFFFFF',
        }}
        title={creditCard.name}
      >
        {initial}
      </div>
      {showName && (
        <span className={`${nameSizeClasses} text-slate-600 dark:text-slate-300 truncate`}>
          {creditCard.name}
        </span>
      )}
    </div>
  );
}

interface CreditCardIconBadgeProps {
  color?: string;
  size?: 'sm' | 'md';
}

export function CreditCardIconBadge({
  color = '#6B7280',
  size = 'sm',
}: CreditCardIconBadgeProps) {
  const sizeClasses = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';

  return (
    <div
      className={`${sizeClasses} flex items-center justify-center`}
      style={{ color }}
    >
      <CreditCardIcon className='w-full h-full' />
    </div>
  );
}

