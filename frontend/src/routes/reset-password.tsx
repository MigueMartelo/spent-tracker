import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { authApi } from '@/lib/api';
import { toast } from 'sonner';
import { Wallet, Lock, ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { ThemeSwitcher } from '@/components/layout/ThemeSwitcher';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

const createResetPasswordSchema = (t: (key: string) => string) =>
  z
    .object({
      password: z.string().min(6, t('auth.passwordMinLength')),
      confirmPassword: z.string().min(1, t('auth.passwordRequired')),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('auth.passwordsDoNotMatch'),
      path: ['confirmPassword'],
    });

type ResetPasswordFormData = z.infer<ReturnType<typeof createResetPasswordSchema>>;

export const Route = createFileRoute('/reset-password')({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      token: (search.token as string) || '',
    };
  },
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { token } = Route.useSearch();

  // Verify token on page load
  const {
    data: tokenValidation,
    isLoading: isVerifying,
    isError: verificationError,
  } = useQuery({
    queryKey: ['verifyResetToken', token],
    queryFn: () => authApi.verifyResetToken(token),
    enabled: !!token,
    retry: false,
  });

  const { mutate: resetPassword, isPending } = useMutation({
    mutationFn: (password: string) => authApi.resetPassword(token, password),
    onSuccess: () => {
      toast.success(t('auth.passwordResetSuccess'));
      navigate({ to: '/login' });
    },
    onError: (error: Error) => {
      toast.error(error.message || t('auth.passwordResetFailed'));
    },
  });

  const resetPasswordSchema = createResetPasswordSchema(t);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    resetPassword(data.password);
  };

  const isTokenValid = tokenValidation?.valid === true;
  const showError = !token || verificationError || (!isVerifying && !isTokenValid);

  return (
    <div className='min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800'>
      {/* Header */}
      <div className='p-4 md:p-6'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2 text-slate-800 dark:text-slate-100'>
            <Wallet className='w-6 h-6 text-emerald-600 dark:text-emerald-500' />
            <span className='font-bold text-lg'>{t('app.name')}</span>
          </div>
          <div className='flex items-center gap-4'>
            <ThemeSwitcher />
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='flex-1 flex items-center justify-center p-4'>
        <Card className='w-full max-w-md shadow-lg'>
          <CardHeader className='space-y-1 pb-4'>
            <CardTitle className='text-2xl font-bold text-center'>
              {t('auth.resetPassword')}
            </CardTitle>
            <CardDescription className='text-center'>
              {showError
                ? t('auth.invalidOrExpiredToken')
                : t('auth.resetPasswordSubtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isVerifying ? (
              <div className='flex flex-col items-center gap-4 py-8'>
                <Loader2 className='w-8 h-8 text-emerald-600 dark:text-emerald-500 animate-spin' />
                <p className='text-slate-600 dark:text-slate-400'>{t('common.loading')}</p>
              </div>
            ) : showError ? (
              <div className='space-y-6'>
                <div className='flex flex-col items-center gap-4 py-4'>
                  <div className='w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center'>
                    <AlertCircle className='w-8 h-8 text-red-600 dark:text-red-500' />
                  </div>
                  <p className='text-center text-slate-600 dark:text-slate-400'>
                    {t('auth.invalidOrExpiredToken')}
                  </p>
                </div>
                <div className='flex flex-col gap-3'>
                  <Link to='/forgot-password'>
                    <Button variant='outline' className='w-full'>
                      {t('auth.requestNewReset')}
                    </Button>
                  </Link>
                  <Link
                    to='/login'
                    className='flex items-center justify-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-500'
                  >
                    <ArrowLeft className='w-4 h-4' />
                    {t('auth.backToLogin')}
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='password'>{t('auth.newPassword')}</Label>
                  <div className='relative'>
                    <Lock className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500' />
                    <Input
                      id='password'
                      type='password'
                      {...register('password')}
                      placeholder='••••••••'
                      className='pl-10 h-11'
                    />
                  </div>
                  {errors.password && (
                    <p className='text-sm text-red-500'>{errors.password.message}</p>
                  )}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='confirmPassword'>{t('auth.confirmPassword')}</Label>
                  <div className='relative'>
                    <Lock className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500' />
                    <Input
                      id='confirmPassword'
                      type='password'
                      {...register('confirmPassword')}
                      placeholder='••••••••'
                      className='pl-10 h-11'
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className='text-sm text-red-500'>
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <Button
                  type='submit'
                  className='w-full h-11 text-base'
                  disabled={isPending}
                >
                  {isPending ? t('common.saving') : t('auth.resetPassword')}
                </Button>

                <div className='pt-2'>
                  <Link
                    to='/login'
                    className='flex items-center justify-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-500'
                  >
                    <ArrowLeft className='w-4 h-4' />
                    {t('auth.backToLogin')}
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
