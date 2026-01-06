import { useTranslation } from 'react-i18next';

export function Footer() {
  const { t } = useTranslation();
  return (
    <div className='p-4 text-center text-xs text-slate-400'>
      {t('footer.copyright', { year: new Date().getFullYear() })}
      <br />
      {t('footer.madeWith')}{' '}
      <a
        href='https://www.linkedin.com/in/miguemartelo/'
        target='_blank'
        rel='noopener noreferrer'
        className='text-emerald-600 hover:text-emerald-700 hover:underline'
      >
        Migue Martelo
      </a>
    </div>
  );
}

