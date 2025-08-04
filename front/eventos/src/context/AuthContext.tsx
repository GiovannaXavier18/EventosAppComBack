import { createContext, useState, useContext, type ReactNode, useEffect } from 'react';
import type { LoginPayload, User } from '../types/api';
import { loginRequest, logoutRequest, checkAuthStatusRequest } from '../services/authService';
import { useQueryClient } from '@tanstack/react-query';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    async function validateToken() {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const { data } = await checkAuthStatusRequest();
          setUser(data);
        } catch (error) {
          localStorage.removeItem('authToken');
          setUser(null);
        }
      }
      setIsLoading(false);
    }
    validateToken();
  }, []);

  const login = async (credentials: LoginPayload) => {
    const { data } = await loginRequest(credentials); 
    localStorage.setItem('authToken', data.token);
    setUser(data.user);
  };

  const logout = async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
        try {
            await logoutRequest();
        } catch (error) {
            console.error("Logout failed on server, proceeding with client-side logout.", error);
        }
    }
    localStorage.removeItem('authToken');
    setUser(null);
    queryClient.clear();
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}