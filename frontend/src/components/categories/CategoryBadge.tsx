import { Category } from '@/types';
import { Tag } from 'lucide-react';

interface CategoryBadgeProps {
  category: Category;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
}

export function CategoryBadge({
  category,
  size = 'md',
  showName = true,
}: CategoryBadgeProps) {
  const initial = category.name.charAt(0).toUpperCase();

  const sizeClasses = {
    sm: 'w-5 h-5 text-[10px]',
    md: 'w-6 h-6 text-xs',
    lg: 'w-8 h-8 text-sm',
  }[size];

  const nameSizeClasses = {
    sm: 'text-[10px] max-w-[60px]',
    md: 'text-xs max-w-[80px]',
    lg: 'text-sm max-w-[100px]',
  }[size];

  return (
    <div className='flex items-center gap-1.5'>
      <div
        className={`${sizeClasses} rounded flex items-center justify-center font-bold shadow-sm shrink-0`}
        style={{
          backgroundColor: category.color,
          color: category.textColor || '#FFFFFF',
        }}
        title={category.name}
      >
        {initial}
      </div>
      {showName && (
        <span className={`${nameSizeClasses} text-slate-600 truncate`}>
          {category.name}
        </span>
      )}
    </div>
  );
}

interface CategoryIconBadgeProps {
  color?: string;
  size?: 'sm' | 'md';
}

export function CategoryIconBadge({
  color = '#6B7280',
  size = 'sm',
}: CategoryIconBadgeProps) {
  const sizeClasses = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';

  return (
    <div
      className={`${sizeClasses} flex items-center justify-center`}
      style={{ color }}
    >
      <Tag className='w-full h-full' />
    </div>
  );
}
