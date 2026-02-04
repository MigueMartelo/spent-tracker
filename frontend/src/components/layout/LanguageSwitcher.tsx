import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
];

interface LanguageSwitcherProps {
  compact?: boolean;
}

export function LanguageSwitcher({ compact = false }: LanguageSwitcherProps) {
  const { i18n } = useTranslation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const currentLang = languages.find((lang) => lang.code === i18n.language);

  // Compact mode: toggle between languages with flag button
  if (compact) {
    const toggleLanguage = () => {
      const currentIndex = languages.findIndex(
        (lang) => lang.code === i18n.language
      );
      const nextIndex = (currentIndex + 1) % languages.length;
      changeLanguage(languages[nextIndex].code);
    };

    return (
      <Button
        variant='ghost'
        size='icon'
        className='h-8 w-8 text-base'
        onClick={toggleLanguage}
        title={currentLang?.name}
      >
        {currentLang?.flag || '🌐'}
      </Button>
    );
  }

  // Full mode: dropdown select
  return (
    <div className='flex items-center gap-2'>
      <Globe className='w-4 h-4 text-slate-500' />
      <Select value={i18n.language} onValueChange={changeLanguage}>
        <SelectTrigger className='w-[140px] h-8'>
          <SelectValue>
            {currentLang?.flag} {currentLang?.name}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {languages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              <span className='flex items-center gap-2'>
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

