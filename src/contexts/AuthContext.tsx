'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { User, AuthContextType, RegisterData } from '@/types';
import { authService } from '@/lib/services';
import { encryptText } from '../lib/utils';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = Cookies.get('auth-token');

      if (savedToken) {
        setToken(savedToken);
        try {
          const userData = await authService.getProfile();
          setUser(userData);
        } catch (error) {
          console.error('Error loading user profile:', error);
          Cookies.remove('auth-token');
          setToken(null);
        }
      }

      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login(encryptText(email), encryptText(password));
      setUser(response.user);
      setToken(response.token);
      Cookies.set('auth-token', response.token, { expires: 7 }); // 7 días
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      userData.email = encryptText(userData.email);
      userData.password = encryptText(userData.password);
      userData.fullName = encryptText(userData.fullName);
      userData.professionalTitle = encryptText(userData.professionalTitle || '');
      userData.company = encryptText(userData.company || '');
      const response = await authService.register(userData);
      setUser(response.user);
      setToken(response.token);
      Cookies.set('auth-token', response.token, { expires: 7 });
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    Cookies.remove('auth-token');
  };

  const updateProfile = async (userData: Partial<User>) => {
    try {
      const updatedUser = await authService.updateProfile(userData);
      setUser(updatedUser);
    } catch (error) {
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    updateProfile,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
