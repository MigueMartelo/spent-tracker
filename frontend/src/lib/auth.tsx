import { User } from '@/types';
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { getToken, removeToken } from './api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in on mount
  useEffect(() => {
    const token = getToken();
    if (token) {
      // Token exists, but we don't have user info yet
      // We'll set user when they successfully login/register
      setIsAuthenticated(true);
    }
  }, []);

  const handleSetUser = (newUser: User | null) => {
    setUser(newUser);
    setIsAuthenticated(!!newUser);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    removeToken();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        setUser: handleSetUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
