/**
 * ============================================================================
 * MODEL: Avaliação de Desempenho
 * ============================================================================
 * 
 * Schema para avaliações de colaboradores e líderes
 * 
 * ============================================================================
 */

import { ObjectId } from 'mongodb';

export type TipoAvaliacao = 'Líder' | 'Colaborador';
export type StatusAvaliacao = 'Pendente' | 'Concluída' | 'Expirada';

export interface Criterio {
  nome: string;
  nota: number; // 1-5
  comentario?: string;
}

export interface Avaliacao {
  _id?: ObjectId;
  
  // Tipo
  tipo: TipoAvaliacao;
  
  // Avaliador (quem está avaliando)
  avaliadorId: ObjectId;
  avaliadorNome: string;
  avaliadorSetor: string;
  
  // Avaliado (quem está sendo avaliado)
  avaliadoId: ObjectId;
  avaliadoNome: string;
  avaliadoSetor: string;
  avaliadoCargo: string;
  
  // Critérios avaliados
  criterios: Criterio[];
  
  // Feedback geral
  pontosFortesGerais?: string;
  pontosAMelhorarGerais?: string;
  sugestoesGerais?: string;
  
  // Avaliação numérica
  notaFinal: number; // Média dos critérios
  
  // Status e controle
  status: StatusAvaliacao;
  dataLimite?: Date;
  
  // Metadados
  criadoEm: Date;
  atualizadoEm: Date;
  concluidaEm?: Date;
}

export interface CreateAvaliacaoDTO {
  tipo: TipoAvaliacao;
  avaliadorId: ObjectId;
  avaliadoId: ObjectId;
  dataLimite?: Date;
}

export interface SubmitAvaliacaoDTO {
  criterios: Criterio[];
  pontosFortesGerais?: string;
  pontosAMelhorarGerais?: string;
  sugestoesGerais?: string;
}

export interface AvaliacaoLog {
  _id?: ObjectId;
  avaliacaoId: ObjectId;
  tipo: TipoAvaliacao;
  
  // Envolvidos
  avaliadorId: ObjectId;
  avaliadorNome: string;
  avaliadoId: ObjectId;
  avaliadoNome: string;
  
  // Ação
  acao: 'criada' | 'iniciada' | 'concluída' | 'editada' | 'cancelada';
  descricao: string;
  
  // Metadados
  criadoEm: Date;
  usuarioIp?: string;
}

/**
 * Índices recomendados
 */
export const avaliacaoIndexes = [
  { key: { avaliadorId: 1, status: 1 } },
  { key: { avaliadoId: 1, status: 1 } },
  { key: { tipo: 1, status: 1 } },
  { key: { criadoEm: -1 } },
];

export const avaliacaoLogIndexes = [
  { key: { avaliacaoId: 1, criadoEm: -1 } },
  { key: { avaliadorId: 1 } },
  { key: { avaliadoId: 1 } },
];
