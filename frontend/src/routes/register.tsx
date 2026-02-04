import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
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
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';
import { User } from '@/types';
import { Wallet, Mail, Lock, User as UserIcon } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { ThemeSwitcher } from '@/components/layout/ThemeSwitcher';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

const createRegisterSchema = (t: (key: string) => string) => z.object({
  email: z.string().email(t('auth.invalidEmail')),
  password: z.string().min(6, t('auth.passwordMinLength')),
  name: z.string().optional(),
});

type RegisterFormData = z.infer<ReturnType<typeof createRegisterSchema>>;

export const Route = createFileRoute('/register')({
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const { t } = useTranslation();

  const { mutate: register, isPending } = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      setUser(data.user as User);
      toast.success(t('auth.accountCreatedSuccess'));
      navigate({ to: '/expenses' });
    },
    onError: (error: Error) => {
      toast.error(error.message || t('auth.registerFailed'));
    },
  });

  const registerSchema = createRegisterSchema(t);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormData) => {
    register(data);
  };

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
              {t('auth.createAccount')}
            </CardTitle>
            <CardDescription className='text-center'>
              {t('auth.startTracking')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='name'>{t('auth.name')}</Label>
                <div className='relative'>
                  <UserIcon className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500' />
                  <Input
                    id='name'
                    {...registerField('name')}
                    placeholder='John Doe'
                    className='pl-10 h-11'
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='email'>{t('auth.email')}</Label>
                <div className='relative'>
                  <Mail className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500' />
                  <Input
                    id='email'
                    type='email'
                    {...registerField('email')}
                    placeholder='you@example.com'
                    className='pl-10 h-11'
                  />
                </div>
                {errors.email && (
                  <p className='text-sm text-red-500'>{errors.email.message}</p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='password'>{t('auth.password')}</Label>
                <div className='relative'>
                  <Lock className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500' />
                  <Input
                    id='password'
                    type='password'
                    {...registerField('password')}
                    placeholder='••••••••'
                    className='pl-10 h-11'
                  />
                </div>
                {errors.password && (
                  <p className='text-sm text-red-500'>
                    {errors.password.message}
                  </p>
                )}
                <p className='text-xs text-slate-500 dark:text-slate-400'>
                  {t('auth.passwordMinLength')}
                </p>
              </div>

              <Button
                type='submit'
                className='w-full h-11 text-base'
                disabled={isPending}
              >
                {isPending ? t('auth.registering') : t('auth.register')}
              </Button>

              <p className='text-center text-sm text-slate-600 dark:text-slate-400 pt-2'>
                {t('auth.alreadyHaveAccount')}{' '}
                <Link
                  to='/login'
                  className='font-medium text-emerald-600 dark:text-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400 hover:underline'
                >
                  {t('auth.login')}
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
