import { Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { LogOut, Menu, X, Wallet, CreditCard } from 'lucide-react';
import { useState } from 'react';
import { Footer } from './Footer';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate({ to: '/login' });
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100'>
      {/* Navigation */}
      <nav className='bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50'>
        <div className='container mx-auto px-4'>
          <div className='flex justify-between items-center h-14 md:h-16'>
            {/* Logo */}
            <Link
              to='/expenses'
              className='flex items-center gap-2 text-lg md:text-xl font-bold text-slate-800'
            >
              <Wallet className='w-5 h-5 md:w-6 md:h-6 text-emerald-600' />
              <span className='hidden sm:inline'>Expense Tracker</span>
              <span className='sm:hidden'>Expenses</span>
            </Link>

            {/* Desktop Menu */}
            <div className='hidden md:flex items-center gap-4'>
              {user && (
                <>
                  <Link to='/credit-cards'>
                    <Button variant='ghost' size='sm' className='gap-2'>
                      <CreditCard className='w-4 h-4' />
                      Credit Cards
                    </Button>
                  </Link>
                  <span className='text-sm text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full'>
                    Hi {user.name}
                  </span>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={handleLogout}
                    className='gap-2'
                  >
                    <LogOut className='w-4 h-4' />
                    Logout
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className='md:hidden p-2 -mr-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors'
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label='Toggle menu'
            >
              {mobileMenuOpen ? (
                <X className='w-5 h-5' />
              ) : (
                <Menu className='w-5 h-5' />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className='md:hidden py-3 border-t border-slate-200 animate-in slide-in-from-top-2 duration-200'>
              {user && (
                <div className='space-y-3'>
                  <div className='px-1'>
                    <p className='text-xs text-slate-500 uppercase tracking-wider mb-1'>
                      Signed in as
                    </p>
                    <p className='text-sm font-medium text-slate-800 truncate'>
                      {user.email}
                    </p>
                  </div>
                  <Link
                    to='/credit-cards'
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      variant='outline'
                      size='sm'
                      className='w-full gap-2 justify-center'
                    >
                      <CreditCard className='w-4 h-4' />
                      Credit Cards
                    </Button>
                  </Link>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={handleLogout}
                    className='w-full gap-2 justify-center'
                  >
                    <LogOut className='w-4 h-4' />
                    Logout
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className='pb-20 md:pb-8'>{children}</main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
