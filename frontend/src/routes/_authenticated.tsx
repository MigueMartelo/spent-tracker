import { createFileRoute, Outlet } from '@tanstack/react-router';
import { AppLayout } from '@/components/layout/AppLayout';
import { requireAuth } from '@/lib/route-protection';

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: requireAuth,
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}
