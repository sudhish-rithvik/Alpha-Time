import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authService } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  demoLogin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('alphatime_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      const storedToken = localStorage.getItem('alphatime_token');
      if (storedToken) {
        try {
          const userData = await authService.getMe();
          setUser(userData);
        } catch {
          // If token expired or invalid, keep demo user or clear
          const demoUserStr = localStorage.getItem('alphatime_demo_user');
          if (demoUserStr) {
            setUser(JSON.parse(demoUserStr));
          } else {
            localStorage.removeItem('alphatime_token');
            setToken(null);
            setUser(null);
          }
        }
      }
      setIsLoading(false);
    };

    fetchUser();
  }, []);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem('alphatime_token', newToken);
    localStorage.removeItem('alphatime_demo_user');
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('alphatime_token');
    localStorage.removeItem('alphatime_demo_user');
    setToken(null);
    setUser(null);
  };

  const demoLogin = () => {
    const demoUser: User = {
      id: 'demo-quant-trader',
      email: 'quant@alphatime.trade',
      full_name: 'Institutional Demo Trader',
      created_at: new Date().toISOString(),
    };
    localStorage.setItem('alphatime_demo_user', JSON.stringify(demoUser));
    setUser(demoUser);
    setToken('demo-token');
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, demoLogin }}>
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
