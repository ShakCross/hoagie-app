import React, { createContext, useState, useContext, ReactNode } from 'react';
import { authService } from '../services/api';
import { User, LoginData, RegisterData } from '../types';
import { handleApiRequest } from '../utils/errorHandling';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (data: LoginData) => {
    const response = await handleApiRequest(
      async () => await authService.login(data),
      setIsLoading,
      setError
    );
    
    if (response) {
      setUser(response.user);
    }
  };

  const register = async (data: RegisterData) => {
    const newUser = await handleApiRequest(
      async () => await authService.register(data),
      setIsLoading,
      setError
    );
    
    if (newUser) {
      setUser(newUser);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 