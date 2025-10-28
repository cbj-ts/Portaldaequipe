/**
 * ============================================================================
 * USER CONTEXT - Contexto do Usuário
 * ============================================================================
 *
 * Gerencia informações do usuário logado incluindo:
 * - Dados básicos (nome, email, foto)
 * - Setor/Time
 * - Permissões
 * - Preferências
 *
 * ============================================================================
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface User {
  id: string;
  nome: string;
  email: string;
  foto?: string;
  setor:
    | "Administração"
    | "BI"
    | "Cobrança"
    | "Comunicação"
    | "Contratos"
    | "Financeiro"
    | "Live"
    | "RH"
    | "SDR"
    | "Suporte Aldeia"
    | "Suporte Tribo"
    | "TEI"
    | "Vendas";
  cargo: string;
  isGestor: boolean;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isSetor: (setor: string) => boolean;
}

const UserContext = createContext<UserContextType | undefined>(
  undefined,
);

export function UserProvider({
  children,
}: {
  children: ReactNode;
}) {
  // Mock de usuário - substituir por autenticação real
  const [user, setUser] = useState<User | null>({
    id: "1",
    nome: "João Silva",
    email: "joao.silva@tradestars.com",
    foto: "https://api.dicebear.com/7.x/avataaars/svg?seed=joao",
    setor: "RH", // Altere para 'Financeiro', 'TEI' ou 'RH' para testar visões específicas
    cargo: "TEI",
    isGestor: false,
  });

  const isSetor = (setor: string) => {
    return user?.setor === setor;
  };

  return (
    <UserContext.Provider value={{ user, setUser, isSetor }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error(
      "useUser must be used within a UserProvider",
    );
  }
  return context;
}