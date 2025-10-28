/**
 * ============================================================================
 * MODEL: User (Usuário/Colaborador)
 * ============================================================================
 * 
 * Schema e interfaces para usuários do portal TradeStars
 * 
 * ============================================================================
 */

import { ObjectId } from 'mongodb';

export type SetorType = 
  | 'TEI'
  | 'RH'
  | 'Financeiro'
  | 'Comercial'
  | 'Marketing'
  | 'Diretoria'
  | 'Desenvolvimento';

export type CargoType =
  | 'Analista'
  | 'Coordenador'
  | 'Gerente'
  | 'Diretor'
  | 'CEO'
  | 'Estagiário'
  | 'Assistente';

export interface User {
  _id?: ObjectId;
  nome: string;
  email: string;
  senha?: string; // Hash da senha
  foto?: string; // URL da foto de perfil
  setor: SetorType;
  cargo: CargoType;
  dataAdmissao: Date;
  telefone?: string;
  ramal?: string;
  aniversario?: Date;
  
  // Permissões e controle de acesso
  isLider?: boolean;
  isAdmin?: boolean;
  permissoes?: {
    criarChamados?: boolean;
    gerenciarChamados?: boolean;
    acessarDashboards?: string[]; // Setores que pode visualizar
    gerenciarUsuarios?: boolean;
    gerenciarEventos?: boolean;
    gerenciarCursos?: boolean;
  };
  
  // Status
  ativo: boolean;
  
  // Metadados
  criadoEm: Date;
  atualizadoEm: Date;
  ultimoAcesso?: Date;
}

export interface CreateUserDTO {
  nome: string;
  email: string;
  senha: string;
  setor: SetorType;
  cargo: CargoType;
  dataAdmissao: Date;
  telefone?: string;
  ramal?: string;
  aniversario?: Date;
  isLider?: boolean;
  isAdmin?: boolean;
}

export interface UpdateUserDTO {
  nome?: string;
  email?: string;
  foto?: string;
  setor?: SetorType;
  cargo?: CargoType;
  telefone?: string;
  ramal?: string;
  aniversario?: Date;
  isLider?: boolean;
  isAdmin?: boolean;
  ativo?: boolean;
}

export interface UserProfile {
  _id: ObjectId;
  nome: string;
  email: string;
  foto?: string;
  setor: SetorType;
  cargo: CargoType;
  telefone?: string;
  ramal?: string;
  isLider?: boolean;
  isAdmin?: boolean;
}

/**
 * Índices recomendados para a collection 'users'
 */
export const userIndexes = [
  { key: { email: 1 }, unique: true },
  { key: { setor: 1 } },
  { key: { ativo: 1 } },
  { key: { criadoEm: -1 } },
];
