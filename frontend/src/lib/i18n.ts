import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from '../locales/en/common.json';
import esTranslations from '../locales/es/common.json';

const resources = {
  en: {
    translation: enTranslations,
  },
  es: {
    translation: esTranslations,
  },
};

// Get saved language from localStorage or default to browser language
const getInitialLanguage = (): string => {
  // Check if we're in a browser environment (not SSR)
  if (typeof window === 'undefined') {
    return 'en'; // Default to English on server-side
  }

  const saved = localStorage.getItem('language');
  if (saved && (saved === 'en' || saved === 'es')) {
    return saved;
  }
  
  // Try to detect browser language
  const browserLang = navigator.language.split('-')[0];
  return browserLang === 'es' ? 'es' : 'en';
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getInitialLanguage(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18n;

