/**
 * ============================================================================
 * AUTH CONTEXT - Gerenciamento de Autenticação
 * ============================================================================
 * 
 * Contexto para gerenciar autenticação de usuários
 * 
 * IMPORTANTE:
 * - Este é um exemplo básico de autenticação
 * - Em produção, use JWT tokens e armazenamento seguro
 * - Adicione refresh tokens e expiração
 * 
 * ============================================================================
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserProfile {
  _id: string;
  nome: string;
  email: string;
  setor: string;
  cargo?: string;
  telefone?: string;
  avatar?: string;
}

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
      // Simulação de login para demonstração
      // Em produção, faça uma chamada real à API
      const mockUser: UserProfile = {
        _id: '1',
        nome: 'Usuário Demo',
        email: email,
        setor: 'TEI',
        cargo: 'Desenvolvedor',
      };
      
      // Salvar no localStorage
      localStorage.setItem('tradestars_user', JSON.stringify(mockUser));
      setUser(mockUser);
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
    localStorage.setItem('tradestars_user', JSON.stringify(updatedUser));
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
