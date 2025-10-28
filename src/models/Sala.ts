/**
 * ============================================================================
 * MODEL: Sala (Agendamento de Salas)
 * ============================================================================
 * 
 * Schema para agendamento de salas de reunião
 * 
 * ============================================================================
 */

import { ObjectId } from 'mongodb';

export type StatusReserva = 'Confirmada' | 'Pendente' | 'Cancelada';

export interface Recursos {
  projetor?: boolean;
  tv?: boolean;
  quadroBranco?: boolean;
  videoconferencia?: boolean;
  computador?: boolean;
  cafe?: boolean;
}

export interface Sala {
  _id?: ObjectId;
  nome: string;
  capacidade: number;
  andar?: string;
  localizacao?: string;
  recursos: Recursos;
  foto?: string;
  ativa: boolean;
  descricao?: string;
  
  // Metadados
  criadoEm: Date;
  atualizadoEm: Date;
}

export interface Reserva {
  _id?: ObjectId;
  salaId: ObjectId;
  salaNome: string;
  
  // Quem reservou
  usuarioId: ObjectId;
  usuarioNome: string;
  usuarioSetor: string;
  
  // Data e hora
  dataInicio: Date;
  dataFim: Date;
  
  // Detalhes
  titulo: string;
  descricao?: string;
  participantes?: number;
  recursosNecessarios?: string[];
  
  // Status
  status: StatusReserva;
  
  // Metadados
  criadoEm: Date;
  atualizadoEm: Date;
  canceladaEm?: Date;
  motivoCancelamento?: string;
}

export interface CreateSalaDTO {
  nome: string;
  capacidade: number;
  andar?: string;
  localizacao?: string;
  recursos: Recursos;
  foto?: string;
  descricao?: string;
}

export interface CreateReservaDTO {
  salaId: ObjectId;
  usuarioId: ObjectId;
  dataInicio: Date;
  dataFim: Date;
  titulo: string;
  descricao?: string;
  participantes?: number;
  recursosNecessarios?: string[];
}

export interface UpdateReservaDTO {
  dataInicio?: Date;
  dataFim?: Date;
  titulo?: string;
  descricao?: string;
  participantes?: number;
  recursosNecessarios?: string[];
  status?: StatusReserva;
}

/**
 * Índices recomendados
 */
export const salaIndexes = [
  { key: { nome: 1 }, unique: true },
  { key: { ativa: 1 } },
];

export const reservaIndexes = [
  { key: { salaId: 1, dataInicio: 1 } },
  { key: { usuarioId: 1 } },
  { key: { status: 1 } },
  { key: { dataInicio: 1 } },
];
