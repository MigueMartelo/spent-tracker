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
import { Wallet, Mail, Lock } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const Route = createFileRoute('/login')({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const { mutate: login, isPending } = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setUser(data.user as User);
      toast.success('Logged in successfully');
      navigate({ to: '/expenses' });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to login');
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  return (
    <div className='min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100'>
      {/* Header */}
      <div className='p-4 md:p-6'>
        <div className='flex items-center gap-2 text-slate-800'>
          <Wallet className='w-6 h-6 text-emerald-600' />
          <span className='font-bold text-lg'>Expense Tracker</span>
        </div>
      </div>

      {/* Main Content */}
      <div className='flex-1 flex items-center justify-center p-4'>
        <Card className='w-full max-w-md shadow-lg border-slate-200/50'>
          <CardHeader className='space-y-1 pb-4'>
            <CardTitle className='text-2xl font-bold text-center'>
              Welcome back
            </CardTitle>
            <CardDescription className='text-center'>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='email'>Email</Label>
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

              <div className='space-y-2'>
                <Label htmlFor='password'>Password</Label>
                <div className='relative'>
                  <Lock className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
                  <Input
                    id='password'
                    type='password'
                    {...register('password')}
                    placeholder='••••••••'
                    className='pl-10 h-11'
                  />
                </div>
                {errors.password && (
                  <p className='text-sm text-red-500'>
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type='submit'
                className='w-full h-11 text-base'
                disabled={isPending}
              >
                {isPending ? 'Signing in...' : 'Sign in'}
              </Button>

              <p className='text-center text-sm text-slate-600 pt-2'>
                Don't have an account?{' '}
                <Link
                  to='/register'
                  className='font-medium text-emerald-600 hover:text-emerald-700 hover:underline'
                >
                  Create account
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
