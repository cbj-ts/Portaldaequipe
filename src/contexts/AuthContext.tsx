/**
 * ============================================================================
 * AUTH CONTEXT - Gerenciamento de Autenticação MongoDB
 * ============================================================================
 * 
 * Contexto para gerenciar autenticação de usuários com MongoDB
 * 
 * IMPORTANTE:
 * - Este é um exemplo básico de autenticação
 * - Em produção, use JWT tokens e armazenamento seguro
 * - Adicione refresh tokens e expiração
 * 
 * ============================================================================
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { UserProfile } from '../models/User';
import { ObjectId } from 'mongodb';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, senha: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Carregar usuário do localStorage ao iniciar
  useEffect(() => {
    const loadUser = () => {
      try {
        const savedUser = localStorage.getItem('tradestars_user');
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          // Reconstruir ObjectId
          if (parsedUser._id) {
            parsedUser._id = new ObjectId(parsedUser._id);
          }
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
        localStorage.removeItem('tradestars_user');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, senha: string): Promise<boolean> => {
    try {
      // NOTA: Esta é uma chamada de exemplo
      // Em produção, você deve fazer uma requisição para sua API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });

      if (!response.ok) {
        return false;
      }

      const userData: UserProfile = await response.json();
      
      // Salvar no localStorage
      localStorage.setItem('tradestars_user', JSON.stringify({
        ...userData,
        _id: userData._id.toString() // Converter ObjectId para string
      }));
      
      setUser(userData);
      return true;
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('tradestars_user');
    setUser(null);
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    
    // Atualizar no localStorage
    localStorage.setItem('tradestars_user', JSON.stringify({
      ...updatedUser,
      _id: updatedUser._id.toString()
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        updateProfile,
        isAuthenticated: !!user,
      }}
    >
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
