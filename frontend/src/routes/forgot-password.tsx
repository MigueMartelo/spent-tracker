import { createFileRoute, Link } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
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
import { Wallet, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { useTranslation } from 'react-i18next';

const createForgotPasswordSchema = (t: (key: string) => string) =>
  z.object({
    email: z.string().email(t('auth.invalidEmail')),
  });

type ForgotPasswordFormData = z.infer<ReturnType<typeof createForgotPasswordSchema>>;

export const Route = createFileRoute('/forgot-password')({
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const { t } = useTranslation();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { mutate: forgotPassword, isPending } = useMutation({
    mutationFn: (email: string) => authApi.forgotPassword(email),
    onSuccess: () => {
      setIsSubmitted(true);
    },
    onError: (error: Error) => {
      toast.error(error.message || t('auth.passwordResetFailed'));
    },
  });

  const forgotPasswordSchema = createForgotPasswordSchema(t);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    forgotPassword(data.email);
  };

  return (
    <div className='min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100'>
      {/* Header */}
      <div className='p-4 md:p-6'>
        <div className='flex items-center gap-2 text-slate-800'>
          <Wallet className='w-6 h-6 text-emerald-600' />
          <span className='font-bold text-lg'>{t('app.name')}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className='flex-1 flex items-center justify-center p-4'>
        <Card className='w-full max-w-md shadow-lg border-slate-200/50'>
          <CardHeader className='space-y-1 pb-4'>
            <CardTitle className='text-2xl font-bold text-center'>
              {t('auth.forgotPassword').replace('?', '')}
            </CardTitle>
            <CardDescription className='text-center'>
              {isSubmitted ? t('auth.resetLinkSent') : t('auth.enterEmailForReset')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSubmitted ? (
              <div className='space-y-6'>
                <div className='flex flex-col items-center gap-4 py-4'>
                  <div className='w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center'>
                    <CheckCircle className='w-8 h-8 text-emerald-600' />
                  </div>
                  <p className='text-center text-slate-600'>
                    {t('auth.resetLinkSent')}
                  </p>
                </div>
                <Link
                  to='/login'
                  className='flex items-center justify-center gap-2 text-emerald-600 hover:text-emerald-700 hover:underline'
                >
                  <ArrowLeft className='w-4 h-4' />
                  {t('auth.backToLogin')}
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='email'>{t('auth.email')}</Label>
                  <div className='relative'>
                    <Mail className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
                    <Input
                      id='email'
                      type='email'
                      {...register('email')}
                      placeholder='you@example.com'
                      className='pl-10 h-11'
                    />
                  </div>
                  {errors.email && (
                    <p className='text-sm text-red-500'>{errors.email.message}</p>
                  )}
                </div>

                <Button
                  type='submit'
                  className='w-full h-11 text-base'
                  disabled={isPending}
                >
                  {isPending ? t('auth.sendingResetLink') : t('auth.sendResetLink')}
                </Button>

                <div className='pt-2'>
                  <Link
                    to='/login'
                    className='flex items-center justify-center gap-2 text-sm text-slate-600 hover:text-emerald-600'
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
