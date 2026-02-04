import { createFileRoute, redirect, Link } from '@tanstack/react-router';
import { getToken } from '@/lib/api';
import { useTranslation } from 'react-i18next';
import { Wallet, Check, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Footer } from '@/components/layout/Footer';
import { ThemeSwitcher } from '@/components/layout/ThemeSwitcher';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    const token = getToken();
    if (token) {
      throw redirect({ to: '/expenses' });
    }
  },
  component: LandingPage,
});

function LandingPage() {
  const { t } = useTranslation();

  return (
    <div className='min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800'>
      {/* Header */}
      <header className='p-4 md:p-6'>
        <div className='max-w-6xl mx-auto flex items-center justify-between'>
          <div className='flex items-center gap-2 text-slate-800 dark:text-slate-100'>
            <Wallet className='w-6 h-6 text-emerald-600 dark:text-emerald-500 flex-shrink-0' />
            <span className='font-bold text-lg hidden sm:inline'>
              {t('app.name')}
            </span>
            <span className='font-bold text-lg sm:hidden'>
              {t('app.nameShort')}
            </span>
          </div>
          <div className='flex items-center gap-1 sm:gap-4'>
            {/* Compact switchers on mobile, full on desktop */}
            <div className='hidden sm:block'>
              <ThemeSwitcher />
            </div>
            <div className='sm:hidden'>
              <ThemeSwitcher compact />
            </div>
            <div className='hidden sm:block'>
              <LanguageSwitcher />
            </div>
            <div className='sm:hidden'>
              <LanguageSwitcher compact />
            </div>
            <Link to='/login'>
              <Button variant='ghost' size='sm'>
                {t('auth.login')}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className='flex-1 flex items-center justify-center px-4 py-12 md:py-20'>
        <div className='max-w-4xl mx-auto text-center'>
          <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6'>
            {t('landing.heroTitle')}
          </h1>
          <p className='text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto'>
            {t('landing.heroSubtitle')}
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link to='/register'>
              <Button size='lg' className='w-full sm:w-auto text-base px-8'>
                {t('landing.getStarted')}
              </Button>
            </Link>
            <Link to='/login'>
              <Button
                variant='outline'
                size='lg'
                className='w-full sm:w-auto text-base px-8'
              >
                {t('auth.login')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='px-4 py-12 md:py-16 bg-white/50 dark:bg-slate-800/50'>
        <div className='max-w-6xl mx-auto'>
          <h2 className='text-2xl md:text-3xl font-bold text-center text-slate-900 dark:text-white mb-12'>
            {t('landing.featuresTitle')}
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div className='text-center'>
              <div className='w-12 h-12 mx-auto mb-4 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center'>
                <Check className='w-6 h-6 text-emerald-600 dark:text-emerald-500' />
              </div>
              <h3 className='font-semibold text-slate-900 dark:text-white mb-2'>
                {t('landing.feature1Title')}
              </h3>
              <p className='text-slate-600 dark:text-slate-400'>
                {t('landing.feature1Description')}
              </p>
            </div>
            <div className='text-center'>
              <div className='w-12 h-12 mx-auto mb-4 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center'>
                <Check className='w-6 h-6 text-emerald-600 dark:text-emerald-500' />
              </div>
              <h3 className='font-semibold text-slate-900 dark:text-white mb-2'>
                {t('landing.feature2Title')}
              </h3>
              <p className='text-slate-600 dark:text-slate-400'>
                {t('landing.feature2Description')}
              </p>
            </div>
            <div className='text-center'>
              <div className='w-12 h-12 mx-auto mb-4 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center'>
                <Check className='w-6 h-6 text-emerald-600 dark:text-emerald-500' />
              </div>
              <h3 className='font-semibold text-slate-900 dark:text-white mb-2'>
                {t('landing.feature3Title')}
              </h3>
              <p className='text-slate-600 dark:text-slate-400'>
                {t('landing.feature3Description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className='px-4 py-12 md:py-20'>
        <div className='max-w-4xl mx-auto'>
          <h2 className='text-2xl md:text-3xl font-bold text-center text-slate-900 dark:text-white mb-4'>
            {t('pricing.title')}
          </h2>
          <p className='text-center text-slate-600 dark:text-slate-400 mb-12'>
            {t('pricing.subtitle')}
          </p>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            {/* Free Plan */}
            <Card className='relative'>
              <CardHeader>
                <CardTitle className='text-xl'>{t('pricing.free')}</CardTitle>
                <CardDescription>{t('pricing.freeDescription')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='mb-6'>
                  <span className='text-4xl font-bold text-slate-900 dark:text-white'>
                    $0
                  </span>
                  <span className='text-slate-600 dark:text-slate-400'>
                    /{t('pricing.month')}
                  </span>
                </div>
                <ul className='space-y-3 mb-6'>
                  <li className='flex items-center gap-2 text-slate-600 dark:text-slate-400'>
                    <Check className='w-5 h-5 text-emerald-600 dark:text-emerald-500 flex-shrink-0' />
                    <span>{t('pricing.freeLimit')}</span>
                  </li>
                  <li className='flex items-center gap-2 text-slate-600 dark:text-slate-400'>
                    <Check className='w-5 h-5 text-emerald-600 dark:text-emerald-500 flex-shrink-0' />
                    <span>{t('pricing.freeFeature1')}</span>
                  </li>
                  <li className='flex items-center gap-2 text-slate-600 dark:text-slate-400'>
                    <Check className='w-5 h-5 text-emerald-600 dark:text-emerald-500 flex-shrink-0' />
                    <span>{t('pricing.freeFeature2')}</span>
                  </li>
                </ul>
                <Link to='/register' className='block'>
                  <Button variant='outline' className='w-full'>
                    {t('pricing.getStartedFree')}
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className='relative border-emerald-500 dark:border-emerald-600 border-2'>
              <div className='absolute -top-3 left-1/2 -translate-x-1/2'>
                <span className='bg-emerald-600 text-white text-xs font-semibold px-3 py-1 rounded-full'>
                  {t('pricing.bestValue')}
                </span>
              </div>
              <CardHeader>
                <CardTitle className='text-xl flex items-center gap-2'>
                  <Zap className='w-5 h-5 text-emerald-600 dark:text-emerald-500' />
                  {t('pricing.pro')}
                </CardTitle>
                <CardDescription>{t('pricing.proDescription')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='mb-6'>
                  <span className='text-4xl font-bold text-slate-900 dark:text-white'>
                    $5
                  </span>
                  <span className='text-slate-600 dark:text-slate-400'>
                    /{t('pricing.month')}
                  </span>
                  <p className='text-sm text-slate-500 dark:text-slate-400 mt-1'>
                    {t('pricing.yearlyOption')}
                  </p>
                </div>
                <ul className='space-y-3 mb-6'>
                  <li className='flex items-center gap-2 text-slate-600 dark:text-slate-400'>
                    <Check className='w-5 h-5 text-emerald-600 dark:text-emerald-500 flex-shrink-0' />
                    <span>{t('pricing.unlimited')}</span>
                  </li>
                  <li className='flex items-center gap-2 text-slate-600 dark:text-slate-400'>
                    <Check className='w-5 h-5 text-emerald-600 dark:text-emerald-500 flex-shrink-0' />
                    <span>{t('pricing.proFeature1')}</span>
                  </li>
                  <li className='flex items-center gap-2 text-slate-600 dark:text-slate-400'>
                    <Check className='w-5 h-5 text-emerald-600 dark:text-emerald-500 flex-shrink-0' />
                    <span>{t('pricing.proFeature2')}</span>
                  </li>
                  <li className='flex items-center gap-2 text-slate-600 dark:text-slate-400'>
                    <Check className='w-5 h-5 text-emerald-600 dark:text-emerald-500 flex-shrink-0' />
                    <span>{t('pricing.proFeature3')}</span>
                  </li>
                </ul>
                <Link to='/register' className='block'>
                  <Button className='w-full'>{t('pricing.choosePro')}</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
