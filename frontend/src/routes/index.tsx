import { createFileRoute, redirect } from '@tanstack/react-router';
import { getToken } from '@/lib/api';

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    const token = getToken();
    if (token) {
      throw redirect({ to: '/expenses' });
    } else {
      throw redirect({ to: '/login' });
    }
  },
});
