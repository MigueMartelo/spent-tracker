import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { useTranslation } from 'react-i18next';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Monitor, Moon, Sun } from 'lucide-react';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className='flex items-center gap-2'>
        <Sun className='w-4 h-4 text-slate-500' />
        <div className='w-[140px] h-8 bg-slate-100 dark:bg-slate-800 rounded-md animate-pulse' />
      </div>
    );
  }

  const themes = [
    { value: 'light', label: t('theme.light'), icon: Sun },
    { value: 'dark', label: t('theme.dark'), icon: Moon },
    { value: 'system', label: t('theme.system'), icon: Monitor },
  ];

  const currentTheme = themes.find((t) => t.value === theme);
  const Icon = currentTheme?.icon || Sun;

  return (
    <div className='flex items-center gap-2'>
      <Icon className='w-4 h-4 text-slate-500 dark:text-slate-400' />
      <Select value={theme} onValueChange={setTheme}>
        <SelectTrigger className='w-[140px] h-8'>
          <SelectValue>
            {currentTheme?.label || t('theme.light')}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {themes.map((themeOption) => {
            const ThemeIcon = themeOption.icon;
            return (
              <SelectItem key={themeOption.value} value={themeOption.value}>
                <span className='flex items-center gap-2'>
                  <ThemeIcon className='w-4 h-4' />
                  <span>{themeOption.label}</span>
                </span>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
