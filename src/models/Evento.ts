/**
 * ============================================================================
 * MODEL: Evento (Calendário)
 * ============================================================================
 * 
 * Schema para eventos do calendário corporativo
 * 
 * ============================================================================
 */

import { ObjectId } from 'mongodb';

export type TipoEvento = 
  | 'Reunião'
  | 'Treinamento'
  | 'Evento Corporativo'
  | 'Feriado'
  | 'Deadline'
  | 'Aniversário'
  | 'Outro';

export interface Participante {
  userId: ObjectId;
  nome: string;
  email: string;
  confirmado?: boolean;
  confirmadoEm?: Date;
}

export interface Evento {
  _id?: ObjectId;
  titulo: string;
  descricao?: string;
  tipo: TipoEvento;
  
  // Data e hora
  dataInicio: Date;
  dataFim: Date;
  diaInteiro?: boolean;
  
  // Recorrência
  recorrente?: boolean;
  frequencia?: 'Diária' | 'Semanal' | 'Mensal' | 'Anual';
  
  // Local
  local?: string;
  online?: boolean;
  linkReuniao?: string; // Meet, Zoom, etc
  
  // Participantes
  organizadorId: ObjectId;
  organizadorNome: string;
  participantes?: Participante[];
  setoresConvidados?: string[]; // Setores que podem ver o evento
  
  // Configurações
  cor?: string; // Cor no calendário
  privado?: boolean; // Visível apenas para participantes
  lembrete?: number; // Minutos antes para lembrar
  
  // Metadados
  criadoEm: Date;
  atualizadoEm: Date;
}

export interface CreateEventoDTO {
  titulo: string;
  descricao?: string;
  tipo: TipoEvento;
  dataInicio: Date;
  dataFim: Date;
  diaInteiro?: boolean;
  local?: string;
  online?: boolean;
  linkReuniao?: string;
  organizadorId: ObjectId;
  participantes?: Omit<Participante, 'confirmado' | 'confirmadoEm'>[];
  setoresConvidados?: string[];
  cor?: string;
  privado?: boolean;
  lembrete?: number;
}

export interface UpdateEventoDTO {
  titulo?: string;
  descricao?: string;
  tipo?: TipoEvento;
  dataInicio?: Date;
  dataFim?: Date;
  diaInteiro?: boolean;
  local?: string;
  online?: boolean;
  linkReuniao?: string;
  participantes?: Participante[];
  setoresConvidados?: string[];
  cor?: string;
  privado?: boolean;
  lembrete?: number;
}

/**
 * Índices recomendados para a collection 'eventos'
 */
export const eventoIndexes = [
  { key: { dataInicio: 1 } },
  { key: { dataFim: 1 } },
  { key: { organizadorId: 1 } },
  { key: { 'participantes.userId': 1 } },
  { key: { tipo: 1 } },
  { key: { setoresConvidados: 1 } },
];
