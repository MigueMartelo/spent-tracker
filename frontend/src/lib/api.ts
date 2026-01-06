import type {
  RegisterDto,
  LoginDto,
  CreateExpenseDto,
  UpdateExpenseDto,
  AuthResponse,
  ExpenseFilters,
  Expense,
  CreditCard,
  CreateCreditCardDto,
  UpdateCreditCardDto,
} from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Token management
const TOKEN_KEY = 'expense_tracker_token';

export const getToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null; // SSR: localStorage not available
  }
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string): void => {
  if (typeof window === 'undefined') {
    return; // SSR: localStorage not available
  }
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = (): void => {
  if (typeof window === 'undefined') {
    return; // SSR: localStorage not available
  }
  localStorage.removeItem(TOKEN_KEY);
};

// API client with error handling
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });
  // Handle 401 Unauthorized
  if (response.status === 401) {
    removeToken();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw new Error('Unauthorized');
  }

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `HTTP Error! status: ${response.status}`);
  }

  return response.json();
};

// Auth API
export const authApi = {
  register: async (data: RegisterDto): Promise<AuthResponse> => {
    const response = await apiRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    setToken(response.access_token);
    return response;
  },
  login: async (data: LoginDto): Promise<AuthResponse> => {
    const response = await apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    setToken(response.access_token);
    return response;
  },
};

// Expenses API
export const expensesApi = {
  getAll: async (filters?: ExpenseFilters): Promise<Expense[]> => {
    const params = new URLSearchParams();
    if (filters?.type) params.append('type', filters.type);
    if (filters?.creditCardId) params.append('creditCardId', filters.creditCardId);
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiRequest<Expense[]>(`/expenses${query}`);
  },
  getById: async (id: string): Promise<Expense> => {
    return apiRequest<Expense>(`/expenses/${id}`);
  },
  create: async (data: CreateExpenseDto): Promise<Expense> => {
    return apiRequest<Expense>('/expenses', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  update: async (id: string, data: UpdateExpenseDto): Promise<Expense> => {
    return apiRequest<Expense>(`/expenses/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
  delete: async (id: string): Promise<Expense> => {
    return apiRequest<Expense>(`/expenses/${id}`, {
      method: 'DELETE',
    });
  },
};

// Credit Cards API
export const creditCardsApi = {
  getAll: async (): Promise<CreditCard[]> => {
    return apiRequest<CreditCard[]>('/credit-cards');
  },
  getById: async (id: string): Promise<CreditCard> => {
    return apiRequest<CreditCard>(`/credit-cards/${id}`);
  },
  create: async (data: CreateCreditCardDto): Promise<CreditCard> => {
    return apiRequest<CreditCard>('/credit-cards', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  update: async (id: string, data: UpdateCreditCardDto): Promise<CreditCard> => {
    return apiRequest<CreditCard>(`/credit-cards/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
  delete: async (id: string): Promise<CreditCard> => {
    return apiRequest<CreditCard>(`/credit-cards/${id}`, {
      method: 'DELETE',
    });
  },
};
