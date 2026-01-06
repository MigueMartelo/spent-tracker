import { redirect } from '@tanstack/react-router';
import { getToken } from './api';

export function requireAuth() {
  const token = getToken();
  if (!token) {
    throw redirect({
      to: '/login',
    });
  }
}
